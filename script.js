// Global slider functions
let currentSlide = 0;
let slides = [];
let dots = [];
let autoPlayInterval;

function goToSlide(index) {
    if (!slides || slides.length === 0) return;
    slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    resetAutoPlay();
}

function nextSlide() {
    if (!slides || slides.length === 0) return;
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
}

function prevSlide() {
    if (!slides || slides.length === 0) return;
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(prev);
}

function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 5000);
}

function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
}

// Side Menu Drawer Toggle Logic
function initSideMenu() {
    const sideMenu = document.getElementById('sideMenu');
    const sideMenuOverlay = document.getElementById('sideMenuOverlay');
    const sideMenuToggle = document.getElementById('sideMenuToggle');
    const closeSideMenu = document.getElementById('closeSideMenu');

    function openMenu() {
        if (sideMenu) sideMenu.classList.add('active');
        if (sideMenuOverlay) sideMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        if (sideMenu) sideMenu.classList.remove('active');
        if (sideMenuOverlay) sideMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (sideMenuToggle) {
        sideMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            openMenu();
        });
    }

    if (closeSideMenu) {
        closeSideMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            closeMenu();
        });
    }

    if (sideMenuOverlay) {
        sideMenuOverlay.addEventListener('click', closeMenu);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

    const sideLinks = document.querySelectorAll('.side-link');
    sideLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });
}

// Sync Cart Badges Across Top Navbar and Side Menu
function syncCartBadges() {
    window.cart = JSON.parse(localStorage.getItem('brewHavenCart')) || [];
    const badges = document.querySelectorAll('#global-cart-badge, .cart-badge, .cart-count, span[id*="badge"]');
    const totalItems = window.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    badges.forEach(badge => {
        badge.innerHTML = totalItems.toString();
        badge.textContent = totalItems.toString();
    });
}

// Initialize Lucide vector icons
function refreshLucideIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Side Menu
    initSideMenu();

    // 2. Update cart badge on load
    syncCartBadges();

    // 3. Render Lucide icons
    refreshLucideIcons();

    // 4. Filter tabs functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const category = button.getAttribute('data-category');

            productCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 5. Toast notification
    const toast = document.getElementById('toast');
    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // 6. Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Thanks for reaching out! We\'ll reply shortly.');
            contactForm.reset();
        });
    }

    // 7. Live open/closed status
    function updateStatus() {
        const now = new Date();
        const day = now.getDay();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const time = hour + minute / 60;

        let isOpen = false;

        // Mon-Fri: 6AM - 8PM, Sat-Sun: 7AM - 9PM
        if (day >= 1 && day <= 5) {
            isOpen = time >= 6 && time < 20;
        } else {
            isOpen = time >= 7 && time < 21;
        }

        const badges = document.querySelectorAll('#statusBadge, .live-status-pill');
        badges.forEach(badge => {
            if (isOpen) {
                badge.textContent = 'Open Now';
                badge.classList.remove('closed');
                badge.classList.add('open');
            } else {
                badge.textContent = 'Closed';
                badge.classList.remove('open');
                badge.classList.add('closed');
            }
        });
    }

    updateStatus();
    setInterval(updateStatus, 60000);

    // 8. Hero Slider
    slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const dotsContainer = document.getElementById('sliderDots');

    if (dotsContainer && slides.length > 0 && dotsContainer.children.length === 0) {
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }

    dots = document.querySelectorAll('.dot');

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Start auto-play
    if (slides.length > 0) {
        startAutoPlay();
    }
});
