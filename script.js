// Filter tabs functionality
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
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
        const day = now.getDay(); // 0 = Sunday, 6 = Saturday
        const hour = now.getHours();
        const minute = now.getMinutes();
        const time = hour + minute / 60;

        let isOpen = false;

        // Monday-Friday: 6 AM - 8 PM (6 - 20)
        if (day >= 1 && day <= 5) {
            isOpen = time >= 6 && time < 20;
        }
        // Saturday-Sunday: 7 AM - 9 PM (7 - 21)
        else {
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

    // Hero Slider
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const dotsContainer = document.getElementById('sliderDots');
    let currentSlide = 0;
    let autoPlayInterval;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        resetAutoPlay();
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        goToSlide(next);
    }

    function prevSlide() {
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

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Start auto-play
    startAutoPlay();
});