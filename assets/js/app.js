tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                "primary": "#137fec",
                "background-light": "#ffffff",
                "background-subtle": "#f8fafc",
                "dark-bg": "#0f172a",
                "dark-card": "#1e293b",
            },
            fontFamily: {
                "display": ["Space Grotesk", "sans-serif"],
                "body": ["Noto Sans", "sans-serif"]
            },
            borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
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

// Check for saved theme preference
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}

// Cache version - increment this when you update header/footer/mobile-menu
const CACHE_VERSION = 'v8';

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
let parallaxInitialized = false;
function initParallax() {
    // Prevent adding multiple scroll listeners
    if (parallaxInitialized) {
        return;
    }

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                // Re-query elements on each frame to support dynamic content
                const parallaxElements = document.querySelectorAll('.parallax-slow, .parallax-medium, .parallax-fast');
                if (parallaxElements.length === 0) return;

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

    parallaxInitialized = true;
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
    // Create Chat Container if not exists
    if (!document.getElementById("chat-widget-container")) {
        const chatContainer = document.createElement("div");
        chatContainer.id = "chat-widget-container";
        chatContainer.className = "contents";
        document.body.appendChild(chatContainer);
    }
    const components = [
        { id: "header", file: "global/header.html" },
        { id: "footer", file: "global/footer.html" },
        { id: "mobile-menu-container", file: "global/mobile-menu.html" },
        { id: "portal-header", file: "partials/header.html" },
        { id: "portal-sidebar", file: "partials/sidebar.html" },
        { id: "chat-widget-container", file: "partials/chat.html" }
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

// Chat Widget Logic
function toggleChat() {
    const chatWindow = document.getElementById("chat-window");
    const chatFab = document.getElementById("chat-fab");
    const chatIcon = document.getElementById("chat-icon");

    if (chatWindow && chatFab && chatIcon) {
        chatWindow.classList.toggle("visible");
        chatFab.classList.toggle("active");

        if (chatFab.classList.contains("active")) {
            chatIcon.textContent = "close";
        } else {
            chatIcon.textContent = "chat_bubble";
        }
    }
}

function handleChatSubmit(e) {
    e.preventDefault();
    const input = document.getElementById("chat-input");
    const messages = document.getElementById("chat-messages");

    if (input && input.value.trim() !== "") {
        // User Message
        const userMsg = document.createElement("div");
        userMsg.className = "flex gap-3 max-w-[85%] self-end flex-row-reverse animate-fade-in-up";
        userMsg.innerHTML = `
            <div class="size-8 rounded-full bg-primary flex items-center justify-center text-white shrink-0 mt-1 shadow-sm">
                <span class="material-symbols-outlined text-[16px]">person</span>
            </div>
            <div class="flex flex-col gap-1 items-end">
                 <div class="bg-primary text-white p-3 rounded-2xl rounded-tr-none shadow-md text-sm">
                    ${input.value}
                </div>
            </div>
        `;
        messages.appendChild(userMsg);
        messages.scrollTop = messages.scrollHeight;
        input.value = "";

        setTimeout(() => {
            const botMsg = document.createElement("div");
            botMsg.className = "flex gap-3 max-w-[85%] animate-fade-in-up";
            botMsg.innerHTML = `
                <div class="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1">
                    <span class="material-symbols-outlined text-[16px]">smart_toy</span>
                </div>
                 <div class="flex flex-col gap-1">
                    <div class="bg-white dark:bg-[#1e293b] p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-200">
                        Thanks for your message! I am a demo bot, but I heard you! 🤖
                    </div>
                </div>
            `;
            messages.appendChild(botMsg);
            messages.scrollTop = messages.scrollHeight;
        }, 1000);
    }
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
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (btn && btn.closest('div')?.querySelector('input[type="email"]')) {
            e.preventDefault();
            const emailInput = btn.closest('div').querySelector('input[type="email"]');
            if (emailInput.value && emailInput.checkValidity()) {
                showToast('Success! You have been subscribed to our newsletter.');
                emailInput.value = '';
            } else {
                showToast('Please enter a valid email address.', 'info');
            }
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

    function updateSlider(index) {
        currentIndex = index;
        const offset = -index * 100;
        slider.style.transform = `translateX(${offset}%)`;

        // Update dots
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('bg-primary');
                dot.classList.remove('bg-slate-300', 'dark:bg-slate-600');
            } else {
                dot.classList.remove('bg-primary');
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

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateSlider(index);
            startAutoSlide(); // Reset interval on manual click
        });
    });

    // Start auto slide
    startAutoSlide();

    // Pause on hover
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);
}
