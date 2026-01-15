tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Futuristic Multi-Color Palette
                "primary": "#8b5cf6",
                "primary-light": "#a78bfa",
                "primary-dark": "#7c3aed",
                "neon-cyan": "#00f5ff",
                "neon-magenta": "#ff00ff",
                "neon-violet": "#8b5cf6",
                "neon-blue": "#0ea5e9",
                "neon-pink": "#ec4899",
                "neon-green": "#22d3ee",
                "accent": "#ec4899",
                "accent-alt": "#f97316",
                "background-light": "#f8fafc",
                "background-subtle": "#f1f5f9",
                "dark-bg": "#0f0f23",
                "dark-card": "#1a1a3e",
                "dark-surface": "#2d1b4e",
            },
            fontFamily: {
                // Futuristic Multi-Font System
                "futuristic": ["Orbitron", "Space Grotesk", "sans-serif"],
                "display": ["Rajdhani", "Space Grotesk", "sans-serif"],
                "heading": ["Exo 2", "Space Grotesk", "sans-serif"],
                "body": ["Inter", "Noto Sans", "sans-serif"],
                "accent": ["Space Grotesk", "sans-serif"],
            },
            borderRadius: {
                "DEFAULT": "0.5rem",
                "lg": "0.75rem",
                "xl": "1rem",
                "2xl": "1.25rem",
                "3xl": "1.5rem",
                "full": "9999px"
            },
            backgroundImage: {
                'gradient-futuristic': 'linear-gradient(135deg, #00f5ff 0%, #8b5cf6 50%, #ff00ff 100%)',
                'gradient-aurora': 'linear-gradient(135deg, #00f5ff 0%, #22d3ee 25%, #8b5cf6 50%, #ec4899 75%, #ff00ff 100%)',
                'gradient-cosmic': 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 25%, #2d1b4e 50%, #1e1e4a 75%, #0a0a1a 100%)',
                'gradient-neon': 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)',
            },
            boxShadow: {
                'neon': '0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(0, 245, 255, 0.2)',
                'neon-lg': '0 0 40px rgba(139, 92, 246, 0.4), 0 0 80px rgba(0, 245, 255, 0.3)',
                'glow-cyan': '0 0 30px rgba(0, 245, 255, 0.5)',
                'glow-violet': '0 0 30px rgba(139, 92, 246, 0.5)',
                'glow-magenta': '0 0 30px rgba(255, 0, 255, 0.5)',
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
                'gradient-flow': 'gradientFlow 6s ease infinite',
                'glow-pulse': 'glowPulse 3s ease-in-out infinite',
                'aurora-shift': 'auroraShift 10s ease-in-out infinite',
                'neon-flicker': 'neonFlicker 3s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                gradientFlow: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                glowPulse: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
                    '50%': { boxShadow: '0 0 40px rgba(0, 245, 255, 0.5)' },
                },
                auroraShift: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '25%': { backgroundPosition: '50% 0%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '75%': { backgroundPosition: '50% 100%' },
                },
                neonFlicker: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.8' },
                    '75%': { opacity: '1' },
                    '85%': { opacity: '0.9' },
                }
            }
        },
    },
}

// Simple script to handle theme toggling for demonstration
function toggleTheme() {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
}

// Script to handle mobile menu toggling
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const body = document.body;
    if (menu.classList.contains('translate-x-full')) {
        menu.classList.remove('translate-x-full');
        body.classList.add('overflow-hidden');
    } else {
        menu.classList.add('translate-x-full');
        body.classList.remove('overflow-hidden');
    }
}

// Check for saved theme preference - default to system preference
if ('theme' in localStorage) {
    // Use saved user preference
    if (localStorage.theme === 'light') {
        document.documentElement.classList.remove('dark');
    } else {
        document.documentElement.classList.add('dark');
    }
} else {
    // No saved preference - use system preference (but don't persist it)
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

// Cache version - increment this when you update header/footer/mobile-menu
const CACHE_VERSION = 'v9';

function loadHTML(id, file) {
    const cacheKey = `${file}_${CACHE_VERSION}`;
    const cached = sessionStorage.getItem(cacheKey);

    if (cached) {
        document.getElementById(id).innerHTML = cached;
        afterLoad();
        return;
    }

    // Clear old cached versions of this file
    Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith(file)) {
            sessionStorage.removeItem(key);
        }
    });

    fetch(file)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${file}`);
            }
            return response.text();
        })
        .then(html => {
            sessionStorage.setItem(cacheKey, html);
            document.getElementById(id).innerHTML = html;
            afterLoad();
        })
        .catch(error => console.error(error));
}

function afterLoad() {
    highlightActiveNav();
    initScrollAnimations();
    initTiltEffect();
    initSidebarToggle();
}

function highlightActiveNav() {
    const page = window.location.pathname.split("/").pop() || "index.html";
    // Standardize page name for home and handle directory roots
    const activePage = (page === "" || page === "/") ? "index.html" : page;

    // 1. Sidebar Nav Highlighting (Specific styles)
    const sidebarLinks = document.querySelectorAll("aside nav a");
    sidebarLinks.forEach(link => {
        const href = link.getAttribute("href");
        // Check for exact match or if the href ends with the active page name to handle potential relative path differences
        if (href === activePage || (href && href.endsWith(activePage))) {
            // Apply Active Styles
            link.classList.add("bg-blue-50", "dark:bg-blue-900/20", "text-primary", "dark:text-blue-400", "font-semibold");
            // Remove Inactive/Default Styles that conflict
            link.classList.remove("text-slate-600", "dark:text-[#9dabb9]", "hover:bg-slate-100", "dark:hover:bg-[#283039]", "hover:text-primary", "dark:hover:text-white");

            // Style the icon specifically
            const icon = link.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.classList.add('text-primary', 'dark:text-blue-400');
                icon.classList.remove('group-hover:text-primary');
            }
        } else {
            // Reset to Default Styles
            link.classList.remove("bg-blue-50", "dark:bg-blue-900/20", "text-primary", "dark:text-blue-400", "font-semibold");
            link.classList.add("text-slate-600", "dark:text-[#9dabb9]", "hover:bg-slate-100", "dark:hover:bg-[#283039]", "hover:text-primary", "dark:hover:text-white");

            const icon = link.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.classList.remove('text-primary', 'dark:text-blue-400');
                icon.classList.add('group-hover:text-primary');
            }
        }
    });

    // 2. Global Header/Other Nav Highlighting (Generic styles)
    // Filter out sidebar links to avoid conflicts
    const otherLinks = Array.from(document.querySelectorAll("nav a")).filter(link => !link.closest("aside"));
    otherLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (href === activePage || (href && href.endsWith(activePage))) {
            link.classList.add("text-primary", "font-semibold", "active");
        } else {
            link.classList.remove("text-primary", "font-semibold", "active");
        }
    });
}

function initScrollAnimations() {
    // Enhanced observer with different thresholds for different effects
    const observerOptions = {
        root: null,
        rootMargin: '-50px 0px -100px 0px',
        threshold: [0.1, 0.25, 0.5]
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
                entry.target.classList.add('visible');
                // Once visible, stop observing
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all reveal elements
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => {
        observer.observe(el);
    });

    // Initialize parallax effects
    initParallax();

    // Initialize stat counter animations
    initCounterAnimations();

    // Initialize mouse tracking for glow effects
    initMouseTracking();

    // Initialize staggered grid animations
    initGridStagger();
}

// Parallax scrolling effect
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-slow, .parallax-medium, .parallax-fast');
    if (parallaxElements.length === 0) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;

                parallaxElements.forEach(el => {
                    const speed = el.classList.contains('parallax-fast') ? 0.15
                        : el.classList.contains('parallax-medium') ? 0.08
                            : 0.04;
                    const rect = el.getBoundingClientRect();
                    const elementCenter = rect.top + rect.height / 2;
                    const viewportCenter = window.innerHeight / 2;
                    const distanceFromCenter = elementCenter - viewportCenter;

                    el.style.transform = `translateY(${distanceFromCenter * speed}px)`;
                });

                ticking = false;
            });
            ticking = true;
        }
    });
}

// Animate number counters when they come into view
function initCounterAnimations() {
    const counters = document.querySelectorAll('[data-count], .counter-animate');
    if (counters.length === 0) return;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent;
                const match = text.match(/(\d+)/);

                if (match) {
                    const targetNum = parseInt(match[1]);
                    const suffix = text.replace(/\d+/g, '').trim();
                    const prefix = text.split(/\d/)[0];
                    const duration = 2000;
                    const startTime = performance.now();

                    function updateCounter(currentTime) {
                        const elapsedTime = currentTime - startTime;
                        const progress = Math.min(elapsedTime / duration, 1);

                        // Easing function for smooth animation
                        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                        const currentNum = Math.floor(easeOutQuart * targetNum);

                        el.textContent = prefix + currentNum + suffix;

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            el.textContent = text; // Ensure final value is exact
                        }
                    }

                    requestAnimationFrame(updateCounter);
                }

                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

// Track mouse position for interactive glow effects
function initMouseTracking() {
    const glowElements = document.querySelectorAll('.hover-glow, .cursor-glow');

    glowElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            el.style.setProperty('--mouse-x', `${x}%`);
            el.style.setProperty('--mouse-y', `${y}%`);
        });
    });
}

// Apply staggered animation delays to grid children
function initGridStagger() {
    const staggerGrids = document.querySelectorAll('.grid-stagger');

    staggerGrids.forEach(grid => {
        const children = grid.children;
        Array.from(children).forEach((child, index) => {
            // Add reveal class if not already present
            if (!child.classList.contains('reveal')) {
                child.classList.add('reveal', 'reveal-up');
            }
            // Set custom delay based on index
            child.style.transitionDelay = `${index * 100}ms`;
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // Initial load of global components
    const components = [
        { id: "header", file: "global/header.html" },
        { id: "footer", file: "global/footer.html" },
        { id: "mobile-menu-container", file: "global/mobile-menu.html" },
        { id: "portal-header", file: "partials/header.html" },
        { id: "portal-sidebar", file: "partials/sidebar.html" }
    ];

    let loadedCount = 0;
    components.forEach(comp => {
        const el = document.getElementById(comp.id);
        if (el) {
            loadHTML(comp.id, comp.file);
        }
    });

    // Also initialize animations for static content
    initScrollAnimations();

    // Cookie Consent Logic
    initCookieConsent();

    // New Feature initializations
    initBackToTop();
    initNewsletterFeedback();
    initScrollSpy();
    initContentFilters();
    initReviewsSlider();
    initTiltEffect();
});

// Tilt on hover effect
function initTiltEffect() {
    const tiltElements = document.querySelectorAll('.hover-tilt');

    tiltElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.style.transition = 'transform 0.1s ease-out';
        });

        el.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                // Max rotation 15 degrees
                const rotateX = ((y - centerY) / centerY) * -10;
                const rotateY = ((x - centerX) / centerX) * 10;

                el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            });
        });
        el.addEventListener('mouseleave', () => {
            el.style.transition = 'transform 0.5s ease-out';
            el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });
}


// Notification Dropdown Logic
function toggleNotifications() {
    const dropdown = document.getElementById("notification-dropdown");
    if (dropdown) {
        if (dropdown.classList.contains("hidden")) {
            dropdown.classList.remove("hidden");
            dropdown.classList.add("animate-fade-in-up");
        } else {
            dropdown.classList.add("hidden");
            dropdown.classList.remove("animate-fade-in-up");
        }
    }
}

// Close notifications when clicking outside
document.addEventListener("click", (e) => {
    const dropdown = document.getElementById("notification-dropdown");
    const btn = document.getElementById("notification-btn");

    if (dropdown && !dropdown.classList.contains("hidden")) {
        if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
            dropdown.classList.add("hidden");
        }
    }
});
function initCookieConsent() {
    if (localStorage.getItem('cookieConsent')) return;

    // Create container
    const container = document.createElement('div');
    container.id = 'cookie-consent-container';
    document.body.appendChild(container);

    // Load content
    fetch('global/cookie-consent.html')
        .then(response => response.text())
        .then(html => {
            container.innerHTML = html;

            const banner = document.getElementById('cookie-banner');

            // Show with slight delay
            setTimeout(() => {
                banner.classList.remove('translate-y-[150%]');
            }, 1000);

            // Event Listeners
            document.getElementById('accept-cookies').addEventListener('click', () => {
                handleCookieChoice('accepted');
            });

            document.getElementById('decline-cookies').addEventListener('click', () => {
                handleCookieChoice('declined');
            });

            document.getElementById('cookie-settings').addEventListener('click', () => {
                window.location.href = 'legal.html#cookies';
            });
        });
}

function handleCookieChoice(choice) {
    localStorage.setItem('cookieConsent', choice);
    const banner = document.getElementById('cookie-banner');
    banner.classList.add('translate-y-[150%]');

    // Remove from DOM after transition
    setTimeout(() => {
        document.getElementById('cookie-consent-container').remove();
    }, 700);
}

// Back to Top Logic
function initBackToTop() {
    const btn = document.createElement('button');
    btn.className = 'back-to-top p-3 rounded-full bg-primary text-white shadow-2xl hover:bg-primary/90 hover:-translate-y-1 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-primary/20';
    btn.innerHTML = '<span class="material-symbols-outlined">arrow_upward</span>';
    btn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Toast Notification System
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'glass-toast flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl';

    const icon = type === 'success' ? 'check_circle' : 'info';
    const iconColor = type === 'success' ? 'text-green-500' : 'text-blue-500';

    toast.innerHTML = `
        <span class="material-symbols-outlined ${iconColor}">${icon}</span>
        <span class="text-sm font-bold text-slate-800 dark:text-white">${message}</span>
    `;

    document.body.appendChild(toast);

    // Show
    setTimeout(() => toast.classList.add('visible'), 100);

    // Hide and Remove
    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

// Newsletter Simulation
function initNewsletterFeedback() {
    // We use event delegation since footers are loaded dynamically
    document.addEventListener('click', async (e) => {
        const btn = e.target.closest('button');
        const container = btn?.closest('#newsletter-container');

        if (btn && container) {
            const emailInput = container.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                e.preventDefault();
                if (emailInput.checkValidity()) {
                    const originalContent = btn.innerHTML;
                    btn.disabled = true;
                    btn.innerHTML = '<span class="animate-spin material-symbols-outlined text-xs">progress_activity</span>';

                    try {
                        // Dynamically import the firebase module
                        const { subscribeNewsletter } = await import('./firebase-modules.js' + '?v=' + Date.now());
                        const result = await subscribeNewsletter(emailInput.value);

                        if (result.success) {
                            showToast('Success! You have been subscribed to our newsletter.');
                            emailInput.value = '';
                        } else {
                            showToast('Something went wrong. Please try again.', 'info');
                        }
                    } catch (err) {
                        console.error("Newsletter error:", err);
                        showToast('Error connecting to subscription service.', 'info');
                    } finally {
                        btn.disabled = false;
                        btn.innerHTML = originalContent;
                    }
                } else {
                    showToast('Please enter a valid email address.', 'info');
                }
            }
            // If no email value, let the existing onclick handler (redirect) work if it exists
        }
    });
}

// Unified Scroll-Spy Logic (for Legal & Solutions pages)
function initScrollSpy() {
    const sidebarLinks = document.querySelectorAll('aside nav a[href^="#"], aside div.flex a[href^="#"], .lg\\:hidden a[href^="#"]');
    if (sidebarLinks.length === 0) return;

    const sections = Array.from(new Set(Array.from(sidebarLinks)
        .map(link => {
            const href = link.getAttribute('href');
            return (href && href.length > 1) ? document.querySelector(href) : null;
        })
        .filter(s => s !== null)));

    const activeClasses = ['bg-primary', 'text-white', 'shadow-md', 'shadow-primary/20'];
    const mobileActiveClasses = ['bg-primary', 'text-white', 'shadow-md', 'shadow-primary/20'];
    const inactiveClasses = ['text-slate-600', 'dark:text-slate-400', 'hover:bg-slate-100', 'dark:hover:bg-slate-800', 'hover:text-slate-900', 'dark:hover:text-white'];
    const mobileInactiveClasses = ['text-slate-500', 'dark:text-gray-300', 'hover:bg-gray-50', 'dark:hover:bg-[#1a2538]'];

    function setActive(id) {
        sidebarLinks.forEach(link => {
            const isTarget = link.getAttribute('href') === `#${id}`;
            const isMobile = link.closest('.lg\\:hidden');

            if (isTarget) {
                link.classList.add(...(isMobile ? mobileActiveClasses : activeClasses));
                link.classList.remove(...(isMobile ? mobileInactiveClasses : inactiveClasses));
                if (!isMobile) {
                    const textSpan = link.querySelector('span:not(.material-symbols-outlined)');
                    if (textSpan) { textSpan.classList.add('font-bold'); textSpan.classList.remove('font-medium'); }
                    const icon = link.querySelector('.material-symbols-outlined');
                    if (icon) icon.setAttribute('data-weight', 'fill');
                }
            } else {
                link.classList.remove(...activeClasses, ...mobileActiveClasses);
                link.classList.add(...(isMobile ? mobileInactiveClasses : inactiveClasses));
                if (!isMobile) {
                    const textSpan = link.querySelector('span:not(.material-symbols-outlined)');
                    if (textSpan) { textSpan.classList.remove('font-bold'); textSpan.classList.add('font-medium'); }
                    const icon = link.querySelector('.material-symbols-outlined');
                    if (icon) icon.removeAttribute('data-weight');
                }
            }
        });
    }

    const observerOptions = { root: null, rootMargin: '-120px 0px -70% 0px', threshold: 0 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) setActive(entry.target.getAttribute('id'));
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

// Content Filtering Logic (for Portfolio & Blog pages)
function initContentFilters() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    const filterItems = document.querySelectorAll('[data-category]');
    if (filterButtons.length === 0) return;

    const activeClasses = ['bg-primary', 'text-white', 'shadow-lg', 'shadow-primary/20', 'ring-2', 'ring-primary', 'ring-offset-2', 'ring-offset-slate-50', 'dark:ring-offset-slate-900'];
    const inactiveClasses = ['bg-white', 'dark:bg-slate-800', 'border', 'border-slate-200', 'dark:border-slate-700', 'text-slate-600', 'dark:text-slate-300', 'hover:text-primary', 'hover:border-primary'];

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');

            // Update button states
            filterButtons.forEach(b => {
                b.classList.remove(...activeClasses);
                b.classList.add(...inactiveClasses);
                const checkIcon = b.querySelector('.material-symbols-outlined');
                if (checkIcon) checkIcon.textContent = b.getAttribute('data-icon') || '';
            });

            btn.classList.add(...activeClasses);
            btn.classList.remove(...inactiveClasses);
            const activeIcon = btn.querySelector('.material-symbols-outlined');
            if (activeIcon) activeIcon.textContent = 'check';

            // Filter items
            filterItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = '';
                    setTimeout(() => item.classList.add('visible'), 10);
                } else {
                    item.classList.remove('visible');
                    setTimeout(() => item.style.display = 'none', 500);
                }
            });
        });
    });
}

// Reviews Slider (for Testimonials section)
function initReviewsSlider() {
    const slider = document.getElementById('reviews-slider');
    const dots = document.querySelectorAll('.review-dot');
    if (!slider || dots.length === 0) return;

    let currentIndex = 0;
    const totalSlides = dots.length;
    let interval;

    // Touch swipe variables
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50;

    function updateSlider(index) {
        currentIndex = index;
        const offset = -index * 100;
        slider.style.transform = `translateX(${offset}%)`;

        // Update dots
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('bg-gradient-to-r', 'from-neon-cyan', 'to-neon-violet', 'shadow-neon');
                dot.classList.remove('bg-slate-300', 'dark:bg-slate-600');
            } else {
                dot.classList.remove('bg-gradient-to-r', 'from-neon-cyan', 'to-neon-violet', 'shadow-neon');
                dot.classList.add('bg-slate-300', 'dark:bg-slate-600');
            }
        });
    }

    function startAutoSlide() {
        stopAutoSlide();
        interval = setInterval(() => {
            let nextIndex = (currentIndex + 1) % totalSlides;
            updateSlider(nextIndex);
        }, 5000);
    }

    function stopAutoSlide() {
        if (interval) clearInterval(interval);
    }

    function goToNext() {
        let nextIndex = (currentIndex + 1) % totalSlides;
        updateSlider(nextIndex);
        startAutoSlide();
    }

    function goToPrev() {
        let prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider(prevIndex);
        startAutoSlide();
    }

    function handleSwipe() {
        const swipeDistance = touchEndX - touchStartX;
        if (Math.abs(swipeDistance) < minSwipeDistance) return;

        if (swipeDistance > 0) {
            // Swiped right - go to previous
            goToPrev();
        } else {
            // Swiped left - go to next
            goToNext();
        }
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateSlider(index);
            startAutoSlide(); // Reset interval on manual click
        });
    });

    // Touch event listeners for swipe
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoSlide();
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    // Start auto slide
    startAutoSlide();

    // Pause on hover
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);
}

// Sidebar Toggle Logic
function initSidebarToggle() {
    const sidebar = document.getElementById('global-sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    if (!sidebar || !toggleBtn) return;

    const labels = sidebar.querySelectorAll('.sidebar-label');
    const tooltips = sidebar.querySelectorAll('.collapsed-tooltip');
    const toggleIcon = toggleBtn.querySelector('.material-symbols-outlined');
    const logoImg = sidebar.querySelector('img');

    // Helper to apply state
    function setCollapsed(collapsed) {
        if (collapsed) {
            sidebar.classList.remove('w-72');
            sidebar.classList.add('w-20', 'collapsed');

            // Hide labels immediately to prevent overflow during transition? 
            // Better to transition opacity then hidden. 
            // But for simple implementation:
            labels.forEach(el => {
                el.classList.add('hidden');
            });

            tooltips.forEach(el => el.classList.remove('hidden'));

            toggleIcon.textContent = 'chevron_right';
            if (logoImg) logoImg.classList.add('scale-75');
        } else {
            sidebar.classList.add('w-72');
            sidebar.classList.remove('w-20', 'collapsed');

            labels.forEach(el => {
                el.classList.remove('hidden');
            });

            tooltips.forEach(el => el.classList.add('hidden'));

            toggleIcon.textContent = 'chevron_left';
            if (logoImg) logoImg.classList.remove('scale-75');
        }
        localStorage.setItem('portalSidebarCollapsed', collapsed);
    }

    // Initial State
    // We check immediately to prevent FOUC, but transition might still be visible
    const isCollapsed = localStorage.getItem('portalSidebarCollapsed') === 'true';
    setCollapsed(isCollapsed);

    // Event Listener (Remove old listeners to be safe handled by afterLoad calling multiple times?)
    // Actually toggleBtn is fresh from DOM each time loadHTML runs, so this is fine.
    toggleBtn.onclick = () => {
        const currentlyCollapsed = sidebar.classList.contains('collapsed');
        setCollapsed(!currentlyCollapsed);
    };
}
