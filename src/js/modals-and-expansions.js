// Shared lifecycle for book and service details.
function initDetailsModal() {
    const modal = document.getElementById('book-modal');
    const modalBody = document.getElementById('modal-body');
    const closeButton = modal && modal.querySelector('.modal-close');
    if (!modal || !modalBody || !closeButton) return null;

    let opener;
    let previousOverflow;
    let background;

    function close(restoreFocus = true) {
        if (!modal.classList.contains('show')) return;
        modal.classList.remove('show');
        document.body.style.overflow = previousOverflow;
        background.forEach(function(item) {
            item.element.inert = item.wasInert;
        });
        if (restoreFocus && opener) opener.focus({ preventScroll: true });
    }

    closeButton.addEventListener('click', function() { close(); });
    modal.addEventListener('click', function(e) {
        if (e.target === modal) close();
        // Let the delegated page navigation move focus to Contact after closing.
        const contactLink = e.target.closest('a[href="#contact"]');
        if (contactLink && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) close(false);
    });
    modal.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            close();
        } else if (e.key === 'Tab') {
            const focusable = modal.querySelectorAll('button:not([disabled]), a[href]');
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });

    return {
        show: function(content, trigger) {
            opener = trigger;
            previousOverflow = document.body.style.overflow;
            background = Array.from(document.body.children).filter(function(element) {
                return element !== modal && element.tagName !== 'SCRIPT';
            }).map(function(element) {
                return { element: element, wasInert: element.inert };
            });
            modalBody.innerHTML = content;
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            closeButton.focus();
            background.forEach(function(item) { item.element.inert = true; });
        }
    };
}

// Book Modal Functionality
function initBookModals(detailsModal) {
    const bookButtons = document.querySelectorAll('.book-details-btn');
    if (!detailsModal) return;

    // Book details data
    const bookData = {
        'lucid-dream': {
            title: 'How to have a Lucid Dream: A Practical Guide to Awakening Within Your Dreams',
            author: 'Marc Reynolds',
            cover: './src/images/Lucid_Dream.jpg',
            description: 'Explore the fascinating world of lucid dreaming and learn techniques to control your dreams.',
            fullDescription: 'This comprehensive guide takes you on a journey into the realm of conscious dreaming. Learn proven techniques for recognizing when you\'re dreaming, maintaining awareness, and taking control of your dream experiences. Perfect for beginners and experienced dreamers alike.',
            features: [
                'Step-by-step lucid dreaming techniques',
                'Reality testing methods',
                'Dream journal templates',
                'Scientific background and research',
                'Practical exercises and challenges'
            ],
            amazonLink: null,
            goodreadsLink: null
        },
        'lost-keys': {
            title: 'The Lost Keys: Unlocking the Art of Problem-Solving',
            author: 'Marc Reynolds',
            cover: './src/images/The_Lost_Keys.jpg',
            description: 'How to Approach Problems, Break Them Down, and Find Solutions.',
            fullDescription: 'A mystery that unlocks secrets hidden in plain sight. Learn systematic approaches to problem-solving that can be applied to any challenge in life or work.',
            features: [
                'Framework for breaking down complex problems',
                'Pattern recognition techniques',
                'Creative thinking exercises',
                'Real-world case studies',
                'Decision-making strategies'
            ],
            amazonLink: null,
            goodreadsLink: null
        },
        'work-smarter': {
            title: 'How to Work Smarter, Not Harder: Work-Life Balance Without Losing Momentum',
            author: 'Marc Reynolds',
            cover: './src/images/How_To_Work_Smarter.jpg',
            description: 'Practical strategies and productivity techniques to maximize efficiency and achieve more in less time.',
            fullDescription: 'Discover the secrets to working smarter, not harder. This book provides actionable strategies for maximizing your productivity while maintaining a healthy work-life balance.',
            features: [
                'Time management frameworks',
                'Productivity systems and tools',
                'Energy management techniques',
                'Focus and concentration methods',
                'Work-life integration strategies'
            ],
            amazonLink: null,
            goodreadsLink: null
        },
        'reboot-career': {
            title: 'Reboot Your Career for the AI Generation',
            author: 'Marc Reynolds',
            cover: './src/images/Reboot_Your_Career_for_the_AI_Generation.jpg',
            description: 'Navigate the future of work with AI. Essential strategies for thriving in an AI-powered professional landscape.',
            fullDescription: 'The workplace is rapidly evolving with AI technology. This book provides a roadmap for adapting your skills, positioning yourself for success, and thriving in an AI-enhanced professional world.',
            features: [
                'Understanding AI\'s impact on your industry',
                'Skills to develop for AI-era careers',
                'How to work alongside AI tools',
                'Future-proofing your career',
                'Opportunities in the AI economy'
            ],
            amazonLink: null,
            goodreadsLink: null
        },
        'dream-journal': {
            title: 'Dream Journal',
            author: 'Marc Reynolds',
            cover: './src/images/Cover.jpg',
            description: 'Record and reflect on your dreams with guided prompts and techniques for deeper self-discovery.',
            fullDescription: 'A beautifully designed journal to help you capture and explore your dreams. Features guided prompts, reflection exercises, and techniques for deepening your understanding of your subconscious mind.',
            features: [
                'Daily dream recording templates',
                'Guided reflection prompts',
                'Symbol interpretation guide',
                'Pattern tracking pages',
                'Monthly review sections'
            ],
            amazonLink: null,
            goodreadsLink: null
        }
    };
    
    // Open modal when book detail button clicked
    bookButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const bookId = this.getAttribute('data-book');
            const book = bookData[bookId];
            
            if (book) {
                displayBookModal(book, this);
            }
        });
    });
    
    function displayBookModal(book, trigger) {
        const featuresHTML = book.features.map(function(feature) {
            return '<li>' + feature + '</li>';
        }).join('');
        
        detailsModal.show(`
            <img src="${book.cover}" alt="${book.title} cover" class="modal-book-cover">
            <h2 id="modal-title">${book.title}</h2>
            <p><strong>Author:</strong> ${book.author}</p>
            <p>${book.fullDescription}</p>
            <h3>What's Inside:</h3>
            <ul>
                ${featuresHTML}
            </ul>
            <div class="modal-links">
                ${book.amazonLink ? `<a href="${book.amazonLink}" class="modal-link" target="_blank" rel="noopener noreferrer">Buy on Amazon</a>` : ''}
                ${book.goodreadsLink ? `<a href="${book.goodreadsLink}" class="modal-link" target="_blank" rel="noopener noreferrer">View on Goodreads</a>` : ''}
            </div>
        `, trigger);
    }
}

// Service Card Expansion as Modals
function initServiceExpansion(detailsModal) {
    const expandButtons = document.querySelectorAll('.service-expand-btn');
    if (!detailsModal) return;

    // Services offered on this page; agree the scope before work begins.
    const serviceData = {
        'outline': {
            title: 'Book outline development',
            description: 'Turn your idea into a structure you can write from, with Marc Reynolds.',
            details: {
                'A starting point for your book': [
                    'Talk through your idea, the reader and what you want the book to do',
                    'Organise the main themes and explore a logical structure',
                    'Develop the outline together so you have a direction for your writing'
                ],
                'The approach': 'The scope is agreed before work begins. AI tools can assist the work, and Marc reviews the deliverables.'
            },
            ctaText: 'Discuss your book',
            ctaLink: '#contact'
        },
        'formatting': {
            title: 'Formatting support',
            description: 'Help preparing the layout of an existing manuscript for print or ebook.',
            details: {
                'Start with your manuscript': [
                    'Discuss the format you want to prepare',
                    'Agree the layout work your manuscript needs',
                    'Review the formatted material with Marc'
                ],
                'Scope': 'Formatting support covers the presentation and layout of your manuscript. The scope is agreed before work begins. AI tools can assist the work, and Marc reviews the deliverables.'
            },
            ctaText: 'Discuss your book',
            ctaLink: '#contact'
        },
        'kdp': {
            title: 'KDP publishing support',
            description: 'Support with preparing for Amazon Kindle Direct Publishing.',
            details: {
                'Understand the next step': [
                    'Talk through where you are in the self-publishing process',
                    'Identify the preparation and submission steps you need help with',
                    'Agree which parts Marc will support and which decisions remain with you'
                ],
                'Expectations': 'AI tools can assist preparation, and Marc reviews the deliverables. Publication remains subject to Amazon’s requirements and review. Sales and publishing outcomes are not guaranteed.'
            },
            ctaText: 'Discuss your book',
            ctaLink: '#contact'
        }
    };

    // Open modal when service expand button clicked
    expandButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const serviceId = this.getAttribute('data-service');
            const service = serviceData[serviceId];
            
            if (service) {
                displayServiceModal(service, this);
            }
        });
    });
    
    function displayServiceModal(service, trigger) {
        let detailsHTML = '';
        
        // Build details sections
        for (let key in service.details) {
            const value = service.details[key];
            detailsHTML += '<h3>' + key + ':</h3>';
            
            if (Array.isArray(value)) {
                detailsHTML += '<ul>';
                value.forEach(function(item) {
                    detailsHTML += '<li>' + item + '</li>';
                });
                detailsHTML += '</ul>';
            } else {
                detailsHTML += '<p>' + value + '</p>';
            }
        }
        
        detailsModal.show(`
            <h2 id="modal-title">${service.title}</h2>
            <p class="modal-service-description">${service.description}</p>
            ${detailsHTML}
            <div class="modal-links">
                <a href="${service.ctaLink}" class="modal-link">${service.ctaText}</a>
            </div>
        `, trigger);
    }
}

// Initialize one shared modal controller so every close path restores state.
function initDetails() {
    const detailsModal = initDetailsModal();
    initBookModals(detailsModal);
    initServiceExpansion(detailsModal);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDetails);
} else {
    initDetails();
}
