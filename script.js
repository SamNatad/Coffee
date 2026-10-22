// Global slider functions
let currentSlide = 0;
let slides = [];
let dots = [];
let autoPlayInterval;

function goToSlide(index) {
    if (slides.length === 0) return;
    slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    resetAutoPlay();
}

function nextSlide() {
    if (slides.length === 0) return;
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
}

function prevSlide() {
    if (slides.length === 0) return;
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

document.addEventListener('DOMContentLoaded', () => {
    // Update floating cart badge on load (FIRST)
    window.cart = JSON.parse(localStorage.getItem('brewHavenCart')) || [];
    const badges = document.querySelectorAll('#global-cart-badge, .cart-badge, .cart-count, span[id*="badge"]');
    const totalItems = window.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    badges.forEach(badge => {
        badge.innerHTML = totalItems.toString();
        badge.textContent = totalItems.toString();
    });
    console.log('Cart Badge Updated to:', totalItems);

    // Filter tabs functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const category = button.getAttribute('data-category');

            productCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Toast notification
    const toast = document.getElementById('toast');
    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Thanks for reaching out! We\'ll reply shortly.');
            contactForm.reset();
        });
    }

    // Live open/closed status
    function updateStatus() {
        const now = new Date();
        const day = now.getDay();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const time = hour + minute / 60;

        let isOpen = false;

        if (day >= 1 && day <= 5) {
            isOpen = time >= 6 && time < 20;
        } else {
            isOpen = time >= 7 && time < 21;
        }

        const badge = document.getElementById('statusBadge');
        if (badge) {
            if (isOpen) {
                badge.textContent = 'Open Now';
                badge.classList.remove('closed');
                badge.classList.add('open');
            } else {
                badge.textContent = 'Closed';
                badge.classList.remove('open');
                badge.classList.add('closed');
            }
        }
    }

    updateStatus();
    setInterval(updateStatus, 60000);

    // Hero Slider
    slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const dotsContainer = document.getElementById('sliderDots');

    // Create dots
    if (dotsContainer) {
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