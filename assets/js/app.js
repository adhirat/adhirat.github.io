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
}

function highlightActiveNav() {
    const page = window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".nav a").forEach(link => {
        if (link.getAttribute("href") === page) {
            link.classList.add("active");
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadHTML("header", "global/header.html");
    loadHTML("footer", "global/footer.html");
    loadHTML("mobile-menu-container", "global/mobile-menu.html");
});
