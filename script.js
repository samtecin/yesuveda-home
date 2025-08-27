// ===== ENHANCED YESUVEDA WEBSITE JAVASCRIPT =====
// Advanced features: Theme toggle, animations, form handling, accessibility

// Global Configuration
const CONFIG = {
    animationDuration: 300,
    scrollOffset: 80,
    debounceDelay: 100,
    countUpDuration: 2000,
    whatsappGroup: 'https://chat.whatsapp.com/KDZMvlY2Yv92uBVZa5oVKY?mode=ems_copy_c'
};

// State Management
const STATE = {
    isLoading: true,
    currentTheme: 'light',
    isMenuOpen: false,
    hasScrolled: false,
    countersAnimated: false,
    formSubmitting: false
};

// ===== UTILITY FUNCTIONS =====
const Utils = {
    // Debounce function for performance optimization
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    },

    // Get element with error handling
    getElement(selector) {
        const element = document.querySelector(selector);
        if (!element) {
            console.warn(`Element not found: ${selector}`);
        }
        return element;
    },

    // Get multiple elements with error handling
    getElements(selector) {
        return document.querySelectorAll(selector);
    },

    // Animate number counting
    animateCounter(element, start, end, duration, suffix = '') {
        const startTime = performance.now();
        const startNumber = parseInt(element.textContent) || start;
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(startNumber + (end - startNumber) * easeOutCubic);
            
            element.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = end + suffix;
            }
        };
        
        requestAnimationFrame(updateCounter);
    },

    // Smooth scroll to element
    scrollToElement(element, offset = CONFIG.scrollOffset) {
        if (!element) return;
        
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    },

    // Check if element is in viewport
    isInViewport(element, threshold = 0.1) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        return (
            rect.top <= windowHeight * (1 - threshold) &&
            rect.bottom >= windowHeight * threshold &&
            rect.left <= windowWidth * (1 - threshold) &&
            rect.right >= windowWidth * threshold
        );
    },

    // Local storage with error handling
    storage: {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.warn('LocalStorage not available:', error);
                return false;
            }
        },
        
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.warn('Error reading from localStorage:', error);
                return defaultValue;
            }
        }
    }
};

// ===== LOADING SCREEN MANAGER =====
const LoadingManager = {
    init() {
        this.loadingScreen = Utils.getElement('#loading-screen');
        this.setupLoadingSequence();
    },

    setupLoadingSequence() {
        // Simulate loading delay for better UX
        setTimeout(() => {
            this.hideLoading();
        }, 1500);

        // Hide loading when page is fully loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.hideLoading();
            }, 500);
        });
    },

    hideLoading() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('loaded');
            STATE.isLoading = false;
            
            // Remove from DOM after animation
            setTimeout(() => {
                if (this.loadingScreen.parentNode) {
                    this.loadingScreen.parentNode.removeChild(this.loadingScreen);
                }
            }, 500);
        }
    }
};

// ===== THEME MANAGER =====
const ThemeManager = {
    init() {
        this.themeToggle = Utils.getElement('#theme-toggle');
        this.loadSavedTheme();
        this.setupEventListeners();
    },

    loadSavedTheme() {
        const savedTheme = Utils.storage.get('theme', 'light');
        this.setTheme(savedTheme);
    },

    setupEventListeners() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
            
            // Keyboard support
            this.themeToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });
        }

        // System theme change detection
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (!Utils.storage.get('theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    },

    toggleTheme() {
        const newTheme = STATE.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        Utils.storage.set('theme', newTheme);
    },

    setTheme(theme) {
        STATE.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update theme toggle button
        if (this.themeToggle) {
            this.themeToggle.setAttribute('aria-label', 
                `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
        }
    }
};

// ===== NAVIGATION MANAGER =====
const NavigationManager = {
    init() {
        this.navbar = Utils.getElement('.navbar');
        this.hamburger = Utils.getElement('.hamburger');
        this.navMenu = Utils.getElement('.nav-menu');
        this.navLinks = Utils.getElements('.nav-link');
        
        this.setupEventListeners();
        this.setupScrollBehavior();
    },

    setupEventListeners() {
        // Mobile menu toggle
        if (this.hamburger) {
            this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
            
            // Keyboard support
            this.hamburger.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleMobileMenu();
                }
            });
        }

        // Close mobile menu when clicking nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleNavClick(e);
                this.closeMobileMenu();
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (STATE.isMenuOpen && 
                !this.navMenu.contains(e.target) && 
                !this.hamburger.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && STATE.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
    },

    setupScrollBehavior() {
        const handleScroll = Utils.throttle(() => {
            const scrolled = window.scrollY > 100;
            
            if (scrolled !== STATE.hasScrolled) {
                STATE.hasScrolled = scrolled;
                
                if (this.navbar) {
                    this.navbar.classList.toggle('scrolled', scrolled);
                }
            }
        }, 16); // ~60fps

        window.addEventListener('scroll', handleScroll);
    },

    toggleMobileMenu() {
        STATE.isMenuOpen = !STATE.isMenuOpen;
        
        if (this.hamburger && this.navMenu) {
            this.hamburger.classList.toggle('active', STATE.isMenuOpen);
            this.navMenu.classList.toggle('active', STATE.isMenuOpen);
            
            // Update ARIA attributes
            this.hamburger.setAttribute('aria-expanded', STATE.isMenuOpen);
            this.navMenu.setAttribute('aria-hidden', !STATE.isMenuOpen);
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = STATE.isMenuOpen ? 'hidden' : '';
        }
    },

    closeMobileMenu() {
        if (STATE.isMenuOpen) {
            this.toggleMobileMenu();
        }
    },

    handleNavClick(e) {
        const href = e.target.getAttribute('href');
        
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetElement = Utils.getElement(href);
            
            if (targetElement) {
                Utils.scrollToElement(targetElement);
                this.updateActiveNavLink(href);
            }
        }
    },

    updateActiveNavLink(activeHref) {
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === activeHref);
        });
    }
};

// ===== ANIMATION MANAGER =====
const AnimationManager = {
    init() {
        this.setupIntersectionObserver();
        this.animateCounters();
        this.setupScrollIndicator();
    },

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    
                    // Add staggered animation for grids
                    if (entry.target.classList.contains('services-grid') || 
                        entry.target.classList.contains('sdg-grid')) {
                        this.staggerGridAnimation(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatableElements = Utils.getElements(`
            .service-card, .sdg-card, .about-content, 
            .contact-content, .hero-content, .hero-image,
            .services-grid, .sdg-grid
        `);

        animatableElements.forEach(el => {
            el.classList.add('animate-on-scroll');
            this.observer.observe(el);
        });
    },

    staggerGridAnimation(gridElement) {
        const children = gridElement.children;
        Array.from(children).forEach((child, index) => {
            setTimeout(() => {
                child.classList.add('zoom-in');
            }, index * 100);
        });
    },

    animateCounters() {
        const counterElements = Utils.getElements('[data-count]');
        
        if (counterElements.length === 0) return;

        const countersObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !STATE.countersAnimated) {
                    this.startCounterAnimation(entry.target);
                    STATE.countersAnimated = true;
                    countersObserver.unobserve(entry.target);
                }
            });
        });

        counterElements.forEach(counter => {
            countersObserver.observe(counter);
        });
    },

    startCounterAnimation(element) {
        const finalCount = parseInt(element.getAttribute('data-count')) || 0;
        const suffix = element.textContent.includes('+') ? '+' : '';
        
        Utils.animateCounter(element, 0, finalCount, CONFIG.countUpDuration, suffix);
    },

    setupScrollIndicator() {
        const scrollArrow = Utils.getElement('.scroll-arrow');
        
        if (scrollArrow) {
            scrollArrow.addEventListener('click', () => {
                const servicesSection = Utils.getElement('#services');
                if (servicesSection) {
                    Utils.scrollToElement(servicesSection);
                }
            });
        }
    }
};

// ===== FORM MANAGER =====
const FormManager = {
    init() {
        this.contactForm = Utils.getElement('#contact-form');
        this.setupFormHandling();
    },

    setupFormHandling() {
        if (!this.contactForm) return;

        this.contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Real-time validation
        const inputs = this.contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    },

    async handleFormSubmit(e) {
        e.preventDefault();
        
        if (STATE.formSubmitting) return;

        const submitButton = this.contactForm.querySelector('.btn-submit');
        const formData = new FormData(this.contactForm);
        
        // Validate all fields
        if (!this.validateForm()) {
            this.showNotification('Please correct the errors in the form.', 'error');
            return;
        }

        try {
            STATE.formSubmitting = true;
            this.setButtonLoading(submitButton, true);

            // Simulate form submission (replace with actual endpoint)
            await this.submitFormData(formData);

            this.showNotification('Thank you for your message! We will get back to you soon.', 'success');
            this.contactForm.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            STATE.formSubmitting = false;
            this.setButtonLoading(submitButton, false);
        }
    },

    async submitFormData(formData) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form data:', Object.fromEntries(formData));
                resolve();
            }, 2000);
        });
    },

    validateForm() {
        const requiredFields = this.contactForm.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    },

    validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(field)} is required.`;
        }
        // Email validation
        else if (fieldType === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }
        }
        // Phone validation
        else if (fieldType === 'tel' && value) {
            const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number.';
            }
        }
        // Message length validation
        else if (fieldName === 'message' && value && value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters long.';
        }

        this.showFieldError(field, isValid ? '' : errorMessage);
        return isValid;
    },

    getFieldLabel(field) {
        const label = this.contactForm.querySelector(`label[for="${field.id}"]`);
        return label ? label.textContent.replace('*', '').trim() : field.name;
    },

    showFieldError(field, message) {
        const feedback = field.parentNode.querySelector('.form-feedback');
        if (feedback) {
            feedback.textContent = message;
            field.classList.toggle('error', !!message);
        }
    },

    clearFieldError(field) {
        this.showFieldError(field, '');
    },

    setButtonLoading(button, loading) {
        if (!button) return;
        
        button.classList.toggle('loading', loading);
        button.disabled = loading;
        
        const buttonText = button.querySelector('.btn-text');
        if (buttonText) {
            buttonText.style.opacity = loading ? '0' : '1';
        }
    },

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close" aria-label="Close notification">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        this.styleNotification(notification, type);
        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        });

        // Auto remove after 5 seconds
        const autoRemoveTimeout = setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);

        // Close button functionality
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            clearTimeout(autoRemoveTimeout);
            this.removeNotification(notification);
        });
    },

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    },

    styleNotification(notification, type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            z-index: 10000;
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 400px;
            font-family: var(--font-primary);
        `;

        const content = notification.querySelector('.notification-content');
        content.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.75rem;
        `;

        const closeButton = notification.querySelector('.notification-close');
        closeButton.style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 0.25rem;
            transition: background-color 0.2s;
        `;
    },

    removeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
};

// ===== SERVICE SEARCH MANAGER =====
const ServiceSearchManager = {
    init() {
        this.createSearchInterface();
        this.setupServiceFiltering();
    },

    createSearchInterface() {
        const servicesSection = Utils.getElement('.services');
        if (!servicesSection) return;

        const searchContainer = document.createElement('div');
        searchContainer.className = 'service-search-container';
        searchContainer.innerHTML = `
            <div class="service-search">
                <div class="search-input-wrapper">
                    <input type="text" 
                           placeholder="Search services, SDG goals, or keywords..." 
                           class="service-search-input"
                           aria-label="Search services">
                    <i class="fas fa-search search-icon"></i>
                    <button class="clear-search" aria-label="Clear search" style="display: none;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;

        this.styleSearchContainer(searchContainer);

        const sectionSubtitle = servicesSection.querySelector('.section-subtitle');
        if (sectionSubtitle) {
            sectionSubtitle.parentNode.insertBefore(searchContainer, sectionSubtitle.nextSibling);
        }

        this.searchInput = searchContainer.querySelector('.service-search-input');
        this.clearButton = searchContainer.querySelector('.clear-search');
        
        this.setupSearchEventListeners();
    },

    styleSearchContainer(container) {
        const searchWrapper = container.querySelector('.service-search');
        const inputWrapper = container.querySelector('.search-input-wrapper');
        const input = container.querySelector('.service-search-input');
        const icon = container.querySelector('.search-icon');
        const clearBtn = container.querySelector('.clear-search');

        container.style.cssText = `
            text-align: center;
            margin: 3rem 0;
        `;

        searchWrapper.style.cssText = `
            max-width: 500px;
            margin: 0 auto;
        `;

        inputWrapper.style.cssText = `
            position: relative;
            display: flex;
            align-items: center;
        `;

        input.style.cssText = `
            width: 100%;
            padding: 1rem 3rem 1rem 3rem;
            border: 2px solid var(--border-color);
            border-radius: 50px;
            font-size: 1rem;
            font-family: var(--font-primary);
            background: var(--card-background);
            color: var(--text-primary);
            outline: none;
            transition: all 0.3s ease;
        `;

        icon.style.cssText = `
            position: absolute;
            left: 1rem;
            color: var(--text-muted);
            pointer-events: none;
        `;

        clearBtn.style.cssText = `
            position: absolute;
            right: 1rem;
            background: none;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 50%;
            transition: all 0.2s ease;
        `;
    },

    setupSearchEventListeners() {
        if (!this.searchInput) return;

        const debouncedSearch = Utils.debounce((searchTerm) => {
            this.filterServices(searchTerm);
        }, 300);

        this.searchInput.addEventListener('input', (e) => {
            const value = e.target.value.trim();
            debouncedSearch(value);
            this.toggleClearButton(value.length > 0);
        });

        this.searchInput.addEventListener('focus', () => {
            this.searchInput.style.borderColor = 'var(--primary-color)';
            this.searchInput.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.1)';
        });

        this.searchInput.addEventListener('blur', () => {
            this.searchInput.style.borderColor = 'var(--border-color)';
            this.searchInput.style.boxShadow = 'none';
        });

        if (this.clearButton) {
            this.clearButton.addEventListener('click', () => {
                this.searchInput.value = '';
                this.filterServices('');
                this.toggleClearButton(false);
                this.searchInput.focus();
            });
        }
    },

    toggleClearButton(show) {
        if (this.clearButton) {
            this.clearButton.style.display = show ? 'block' : 'none';
        }
    },

    filterServices(searchTerm) {
        const serviceCards = Utils.getElements('.service-card');
        const sdgCards = Utils.getElements('.sdg-card');
        const categories = Utils.getElements('.service-category');
        
        let visibleCount = 0;

        // Filter service cards
        serviceCards.forEach(card => {
            const title = card.querySelector('h4')?.textContent.toLowerCase() || '';
            const description = card.querySelector('p')?.textContent.toLowerCase() || '';
            const isVisible = !searchTerm || 
                             title.includes(searchTerm.toLowerCase()) || 
                             description.includes(searchTerm.toLowerCase());
            
            card.style.display = isVisible ? 'block' : 'none';
            if (isVisible) visibleCount++;
        });

        // Filter SDG cards
        sdgCards.forEach(card => {
            const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const description = card.querySelector('p')?.textContent.toLowerCase() || '';
            const tags = Array.from(card.querySelectorAll('.service-tag'))
                             .map(tag => tag.textContent.toLowerCase())
                             .join(' ');
            
            const isVisible = !searchTerm || 
                             title.includes(searchTerm.toLowerCase()) || 
                             description.includes(searchTerm.toLowerCase()) ||
                             tags.includes(searchTerm.toLowerCase());
            
            card.style.display = isVisible ? 'block' : 'none';
            if (isVisible) visibleCount++;
        });

        // Hide categories with no visible cards
        categories.forEach(category => {
            const visibleCards = category.querySelectorAll('.service-card:not([style*="display: none"])');
            category.style.display = visibleCards.length > 0 || !searchTerm ? 'block' : 'none';
        });

        this.updateSearchResults(visibleCount, searchTerm);
    },

    updateSearchResults(count, searchTerm) {
        // Remove existing results indicator
        const existingIndicator = Utils.getElement('.search-results-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        // Add new results indicator if searching
        if (searchTerm) {
            const indicator = document.createElement('div');
            indicator.className = 'search-results-indicator';
            indicator.textContent = `Found ${count} result${count !== 1 ? 's' : ''} for "${searchTerm}"`;
            
            indicator.style.cssText = `
                text-align: center;
                margin: 1rem 0 2rem;
                padding: 0.75rem 1.5rem;
                background: var(--background-tertiary);
                border-radius: 2rem;
                color: var(--text-secondary);
                font-size: 0.9rem;
                max-width: 400px;
                margin-left: auto;
                margin-right: auto;
            `;

            const searchContainer = Utils.getElement('.service-search-container');
            if (searchContainer) {
                searchContainer.appendChild(indicator);
            }
        }
    }
};

// ===== ACCESSIBILITY MANAGER =====
const AccessibilityManager = {
    init() {
        this.setupKeyboardNavigation();
        this.setupSkipLinks();
        this.setupFocusManagement();
        this.setupReducedMotion();
    },

    setupKeyboardNavigation() {
        // Enhanced keyboard navigation for interactive elements
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'Escape':
                    this.handleEscapeKey();
                    break;
                case 'Tab':
                    this.handleTabKey(e);
                    break;
                case 'ArrowDown':
                case 'ArrowUp':
                    if (document.activeElement.tagName !== 'INPUT' && 
                        document.activeElement.tagName !== 'TEXTAREA') {
                        this.handleArrowKeys(e);
                    }
                    break;
            }
        });
    },

    handleEscapeKey() {
        // Close mobile menu
        if (STATE.isMenuOpen) {
            NavigationManager.closeMobileMenu();
        }

        // Remove focus from search input
        const searchInput = Utils.getElement('.service-search-input');
        if (document.activeElement === searchInput) {
            searchInput.blur();
        }
    },

    handleTabKey(e) {
        // Trap focus in mobile menu when open
        if (STATE.isMenuOpen) {
            const focusableElements = NavigationManager.navMenu.querySelectorAll(
                'a, button, [tabindex]:not([tabindex="-1"])'
            );
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    },

    handleArrowKeys(e) {
        const sections = ['#home', '#services', '#sdg-goals', '#about', '#contact'];
        const currentSection = this.getCurrentSection();
        const currentIndex = sections.indexOf(currentSection);

        if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
            e.preventDefault();
            const nextSection = Utils.getElement(sections[currentIndex + 1]);
            if (nextSection) {
                Utils.scrollToElement(nextSection);
            }
        } else if (e.key === 'ArrowUp' && currentIndex > 0) {
            e.preventDefault();
            const prevSection = Utils.getElement(sections[currentIndex - 1]);
            if (prevSection) {
                Utils.scrollToElement(prevSection);
            }
        }
    },

    getCurrentSection() {
        const sections = Utils.getElements('section[id]');
        let currentSection = '#home';

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentSection = '#' + section.id;
            }
        });

        return currentSection;
    },

    setupSkipLinks() {
        const skipLink = document.createElement('a');
        skipLink.href = '#services';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-color);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            text-decoration: none;
            z-index: 10000;
            transition: top 0.3s ease;
            font-size: 14px;
        `;

        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);
    },

    setupFocusManagement() {
        // Enhanced focus indicators
        const style = document.createElement('style');
        style.textContent = `
            .focus-visible {
                outline: 3px solid var(--primary-color) !important;
                outline-offset: 2px !important;
            }
        `;
        document.head.appendChild(style);

        // Focus management for dynamic content
        document.addEventListener('focus', (e) => {
            if (e.target.matches('button, a, input, select, textarea, [tabindex]')) {
                e.target.classList.add('focus-visible');
            }
        }, true);

        document.addEventListener('blur', (e) => {
            e.target.classList.remove('focus-visible');
        }, true);
    },

    setupReducedMotion() {
        // Respect user's motion preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.documentElement.style.setProperty('--transition-fast', '0s');
            document.documentElement.style.setProperty('--transition-base', '0s');
            document.documentElement.style.setProperty('--transition-slow', '0s');
        }

        prefersReducedMotion.addEventListener('change', (e) => {
            const duration = e.matches ? '0s' : '';
            document.documentElement.style.setProperty('--transition-fast', duration || '0.15s');
            document.documentElement.style.setProperty('--transition-base', duration || '0.3s');
            document.documentElement.style.setProperty('--transition-slow', duration || '0.5s');
        });
    }
};

// ===== PERFORMANCE MONITOR =====
const PerformanceMonitor = {
    init() {
        this.measurePageLoad();
        this.setupResourceHints();
    },

    measurePageLoad() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (window.performance && window.performance.timing) {
                    const timing = window.performance.timing;
                    const loadTime = timing.loadEventEnd - timing.navigationStart;
                    console.log(`Page load time: ${loadTime}ms`);
                    
                    // Report slow loading (> 3 seconds)
                    if (loadTime > 3000) {
                        console.warn('Slow page load detected');
                    }
                }
            }, 0);
        });
    },

    setupResourceHints() {
        // Preload critical resources
        const criticalResources = [
            'images/YesuVeda-logo.png',
            'images/hero-wellness.jpg'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = 'image';
            document.head.appendChild(link);
        });
    }
};

// ===== MAIN APPLICATION CONTROLLER =====
const YesuVedaApp = {
    async init() {
        console.log('🌱 YesuVeda Website Initializing...');
        
        try {
            // Initialize core managers
            LoadingManager.init();
            ThemeManager.init();
            NavigationManager.init();
            AnimationManager.init();
            FormManager.init();
            ServiceSearchManager.init();
            AccessibilityManager.init();
            PerformanceMonitor.init();

            // Setup global event listeners
            this.setupGlobalEvents();
            
            console.log('✅ YesuVeda Website Initialized Successfully');
            
        } catch (error) {
            console.error('❌ Error initializing YesuVeda Website:', error);
        }
    },

    setupGlobalEvents() {
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pause animations when page is hidden
                document.body.classList.add('page-hidden');
            } else {
                document.body.classList.remove('page-hidden');
            }
        });

        // Handle online/offline status
        window.addEventListener('online', () => {
            FormManager.showNotification('Connection restored!', 'success');
        });

        window.addEventListener('offline', () => {
            FormManager.showNotification('You are currently offline.', 'warning');
        });

        // Handle resize events
        const handleResize = Utils.debounce(() => {
            // Close mobile menu on resize to desktop
            if (window.innerWidth > 991 && STATE.isMenuOpen) {
                NavigationManager.closeMobileMenu();
            }
        }, 250);

        window.addEventListener('resize', handleResize);
    }
};

// ===== INITIALIZE APPLICATION =====
// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => YesuVedaApp.init());
} else {
    YesuVedaApp.init();
}

// Handle any unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
});

// Export for debugging (in development)
if (typeof window !== 'undefined') {
    window.YesuVedaApp = YesuVedaApp;
    window.YesuVedaState = STATE;
}
