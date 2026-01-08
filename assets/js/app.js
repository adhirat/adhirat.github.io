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

function loadHTML(id, file) {
    const cached = sessionStorage.getItem(file);

    if (cached) {
        document.getElementById(id).innerHTML = cached;
        afterLoad();
        return;
    }

    fetch(file)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${file}`);
            }
            return response.text();
        })
        .then(html => {
            sessionStorage.setItem(file, html);
            document.getElementById(id).innerHTML = html;
            afterLoad();
        })
        .catch(error => console.error(error));
}

function afterLoad() {
    highlightActiveNav();
    initScrollAnimations();
}

function highlightActiveNav() {
    const page = window.location.pathname.split("/").pop() || "index.html";

    // Standardize page name for home
    const activePage = (page === "" || page === "/") ? "index.html" : page;

    document.querySelectorAll("nav a").forEach(link => {
        const href = link.getAttribute("href");
        if (href === activePage) {
            link.classList.add("active");
            // Also add a visible indicator class for Tailwind-based styles if needed
            link.classList.add("text-primary");
        } else {
            link.classList.remove("active", "text-primary");
        }
    });
}

function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Once visible, we can stop observing this element
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => {
        observer.observe(el);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // Initial load of global components
    const components = [
        { id: "header", file: "global/header.html" },
        { id: "footer", file: "global/footer.html" },
        { id: "mobile-menu-container", file: "global/mobile-menu.html" }
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
});
