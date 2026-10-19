// Crafty Fox Publishing - Main JavaScript
// Progressive Enhancement approach - site works without JS

(function() {
    'use strict';
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        console.log('🦊 Crafty Fox Publishing - Site Initialized');
        
        // Initialize components
        initMobileMenu();
        initSmoothScrolling();
        initFormHandling();
        initAccessibility();
        
        // Mark site as JS-enabled for progressive enhancement
        document.documentElement.classList.add('js-enabled');
    }
    
    // Mobile Menu Toggle
    function initMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!mobileToggle || !navMenu) return;
        
        mobileToggle.addEventListener('click', function() {
            const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
            
            // Toggle aria-expanded
            mobileToggle.setAttribute('aria-expanded', !isExpanded);
            
            // Toggle menu visibility
            navMenu.classList.toggle('nav-menu--open');
            
            // Toggle body scroll lock on mobile
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
                mobileToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('nav-menu--open');
                document.body.classList.remove('menu-open');
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileToggle.getAttribute('aria-expanded') === 'true') {
                mobileToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('nav-menu--open');
                document.body.classList.remove('menu-open');
                mobileToggle.focus();
            }
        });
    }
    
    // Delegation includes Contact links inserted into service popups.
    function initSmoothScrolling() {
        document.addEventListener('click', function(e) {
            const link = e.target.closest('a[href^="#"]');
            if (!link || e.defaultPrevented || e.button !== 0 ||
                e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

            const targetId = link.getAttribute('href');
            const targetSection = document.getElementById(targetId.slice(1));
            if (!targetSection) return;

            e.preventDefault();
            const mobileToggle = document.querySelector('.mobile-menu-toggle');
            const navMenu = document.querySelector('.nav-menu');
            if (mobileToggle && navMenu) {
                mobileToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('nav-menu--open');
                document.body.classList.remove('menu-open');
            }

            const focusTarget = targetSection.querySelector('h1, h2') || targetSection;
            focusTarget.setAttribute('tabindex', '-1');
            focusTarget.focus({ preventScroll: true });
            targetSection.scrollIntoView({
                behavior: 'auto',
                block: 'start'
            });
            history.pushState(null, '', targetId);
        });
    }

    // Forms stay unavailable until a real Formspree action is configured in HTML.
    function initFormHandling() {
        initForm('.contact-form', '.form-submit', '.form-status', {
            unavailable: 'The enquiry form is currently unavailable. No message can be sent. Please contact Marc on Facebook instead.',
            pending: 'Sending...',
            success: 'Thank you! Your message has been sent successfully.',
            error: 'Sorry, your message could not be sent. Please try again.'
        });
    }

    function hasFormDestination(form) {
        const action = form.getAttribute('action');
        if (!action) return false;
        try {
            const url = new URL(action);
            return url.origin === 'https://formspree.io' &&
                /^\/f\/[a-z0-9]+$/i.test(url.pathname) && !url.search && !url.hash &&
                !url.username && !url.password;
        } catch (error) {
            return false;
        }
    }

    function initForm(selector, buttonSelector, statusSelector, messages) {
        const form = document.querySelector(selector);
        if (!form) return;
        const button = form.querySelector(buttonSelector);
        const status = form.querySelector(statusSelector);
        const originalButtonText = button.textContent;
        let submitting = false;

        button.disabled = !hasFormDestination(form);
        status.textContent = button.disabled ? messages.unavailable : '';

        form.querySelectorAll('input, textarea, select').forEach(function(field) {
            field.addEventListener('blur', function() {
                validateField(field);
            });
        });

        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            if (!hasFormDestination(form)) {
                button.disabled = true;
                status.textContent = messages.unavailable;
                return;
            }
            if (submitting) return;

            let firstInvalidField;
            form.querySelectorAll('input, textarea, select').forEach(function(field) {
                if (!validateField(field) && !firstInvalidField) firstInvalidField = field;
            });
            if (firstInvalidField) {
                status.textContent = '';
                firstInvalidField.focus();
                return;
            }

            submitting = true;
            button.disabled = true;
            button.textContent = messages.pending;
            form.setAttribute('aria-busy', 'true');
            status.textContent = '';
            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                });
                if (!response.ok) throw new Error('Form submission was not accepted');
                status.textContent = messages.success;
                form.reset();
            } catch (error) {
                status.textContent = messages.error;
            } finally {
                submitting = false;
                button.textContent = originalButtonText;
                button.disabled = !hasFormDestination(form);
                form.removeAttribute('aria-busy');
            }
        });
    }

    function validateField(field) {
        const descriptionIds = (field.getAttribute('aria-describedby') || '').split(/\s+/);
        const errorElement = descriptionIds.map(function(id) {
            return document.getElementById(id);
        }).find(function(element) {
            return element && element.classList.contains('form-error');
        });
        let errorMessage = '';

        if (field.type === 'email') field.value = field.value.trim();
        if (field.required && !field.value.trim()) {
            errorMessage = 'This field is required.';
        } else if (field.type === 'email' && field.validity.typeMismatch) {
            // Use the browser's email syntax rules, including plus addressing.
            errorMessage = 'Please enter a valid email address.';
        }

        if (errorElement) errorElement.textContent = errorMessage;
        field.classList.toggle('form-input--error', Boolean(errorMessage));
        field.setAttribute('aria-invalid', String(Boolean(errorMessage)));
        return !errorMessage;
    }

    // Accessibility Enhancements
    function initAccessibility() {
        // Add focus-visible polyfill behavior for older browsers
        addFocusVisibleSupport();
        
        // Add skip links functionality
        initSkipLinks();
        
        // Announce dynamic content changes to screen readers
        initAriaLiveRegions();
    }
    
    function addFocusVisibleSupport() {
        // Add focus-visible class for keyboard navigation
        let hadKeyboardEvent = true;
        
        const keyboardThrottleTimeout = 100;
        let timeoutId;
        
        function markKeyboardEvent() {
            hadKeyboardEvent = true;
        }
        
        function markPointerEvent() {
            hadKeyboardEvent = false;
        }
        
        function onFocus(e) {
            if (hadKeyboardEvent || e.target.matches(':focus-visible')) {
                e.target.classList.add('focus-visible');
            }
        }
        
        function onBlur(e) {
            e.target.classList.remove('focus-visible');
        }
        
        document.addEventListener('keydown', markKeyboardEvent);
        document.addEventListener('mousedown', markPointerEvent);
        document.addEventListener('focus', onFocus, true);
        document.addEventListener('blur', onBlur, true);
    }
    
    function initSkipLinks() {
        const skipLinks = document.querySelectorAll('.skip-link');
        
        skipLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    e.preventDefault();
                    target.focus();
                    target.scrollIntoView({ behavior: 'auto' });
                }
            });
        });
    }
    
    function initAriaLiveRegions() {
        // Ensure status messages are announced to screen readers
        const statusElements = document.querySelectorAll('[role=\"status\"], [aria-live]');
        
        statusElements.forEach(function(element) {
            // Ensure proper ARIA attributes
            if (!element.getAttribute('aria-live')) {
                element.setAttribute('aria-live', 'polite');
            }
        });
    }
    
})();
