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
        initBookModals();
        initServiceExpansion();
        
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
            if (e.key === 'Escape') {
                mobileToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('nav-menu--open');
                document.body.classList.remove('menu-open');
                mobileToggle.focus();
            }
        });
    }
    
    // Smooth Scrolling for Navigation Links
    function initSmoothScrolling() {
        const navLinks = document.querySelectorAll('a[href^=\"#\"]');
        
        navLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    e.preventDefault();
                    
                    // Close mobile menu if open
                    const mobileToggle = document.querySelector('.mobile-menu-toggle');
                    const navMenu = document.querySelector('.nav-menu');
                    if (mobileToggle && navMenu) {
                        mobileToggle.setAttribute('aria-expanded', 'false');
                        navMenu.classList.remove('nav-menu--open');
                        document.body.classList.remove('menu-open');
                    }
                    
                    // Smooth scroll to target
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update URL without triggering scroll
                    if (history.pushState) {
                        history.pushState(null, null, targetId);
                    }
                    
                    // Focus management for accessibility
                    setTimeout(function() {
                        targetSection.focus({ preventScroll: true });
                    }, 500);
                }
            });
        });
    }
    
    // Form Handling
    function initFormHandling() {
        initContactForm();
        initNewsletterForm();
    }
    
    function initContactForm() {
        const contactForm = document.querySelector('.contact-form');
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic client-side validation
            if (validateContactForm(this)) {
                submitContactForm(this);
            }
        });
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(function(input) {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }
    
    function validateContactForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(function(field) {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    function validateField(field) {
        const errorElement = document.getElementById(field.getAttribute('aria-describedby'));
        let isValid = true;
        let errorMessage = '';
        
        // Required field validation
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'This field is required.';
        }
        
        // Email validation
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }
        }
        
        // Update UI
        if (errorElement) {
            errorElement.textContent = errorMessage;
        }
        
        field.classList.toggle('form-input--error', !isValid);
        field.setAttribute('aria-invalid', !isValid);
        
        return isValid;
    }
    
    function submitContactForm(form) {
        const submitButton = form.querySelector('.form-submit');
        const statusElement = form.querySelector('.form-status');
        const originalButtonText = submitButton.textContent;
        
        // Update UI to show loading state
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Submit form using Formspree
        const formData = new FormData(form);
        
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(function(response) {
            if (response.ok) {
                statusElement.innerHTML = '<div class=\"form-success\">Thank you! Your message has been sent successfully.</div>';
                form.reset();
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .catch(function(error) {
            console.error('Form submission error:', error);
            statusElement.innerHTML = '<div class=\"form-error\">Sorry, there was an error sending your message. Please try again.</div>';
        })
        .finally(function() {
            // Reset button state
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        });
    }
    
    function initNewsletterForm() {
        const newsletterForm = document.querySelector('.newsletter-form');
        if (!newsletterForm) return;
        
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('#newsletter-email');
            if (validateField(emailInput)) {
                submitNewsletterForm(this);
            }
        });
    }
    
    function submitNewsletterForm(form) {
        const submitButton = form.querySelector('.newsletter-submit');
        const statusElement = form.querySelector('.newsletter-status');
        const originalButtonText = submitButton.textContent;
        
        // Update UI to show loading state
        submitButton.textContent = 'Subscribing...';
        submitButton.disabled = true;
        
        // Submit form using Formspree
        const formData = new FormData(form);
        
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(function(response) {
            if (response.ok) {
                statusElement.innerHTML = '<div class=\"newsletter-success\">Thank you for subscribing!</div>';
                form.reset();
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .catch(function(error) {
            console.error('Newsletter subscription error:', error);
            statusElement.innerHTML = '<div class=\"newsletter-error\">Sorry, there was an error. Please try again.</div>';
        })
        .finally(function() {
            // Reset button state
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        });
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
                    target.scrollIntoView({ behavior: 'smooth' });
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