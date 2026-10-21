// Global Cart State Preservation
window.cart = window.cart || [];

// DOM elements
let sizeSelect, milkSelect, sugarSlider, priceDisplay, itemTitle;

// Price add-ons
const sizeAddons = {
    'Small': 0,
    'Medium': 20,
    'Large': 35
};

const milkAddons = {
    'Whole Milk': 0,
    'Oat Milk': 30,
    'Almond Milk': 30,
    'Skim Milk': 0
};

let basePrice = 140.00;

// 2. Function to update the red floating cart badge count
function updateCartBadge() {
    const totalCount = window.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const badgeElements = document.querySelectorAll('#cart-badge, .cart-badge, .cart-count');
    badgeElements.forEach(badge => {
        badge.textContent = totalCount.toString();
        badge.style.display = 'inline-block';
        badge.classList.remove('pop');
        void badge.offsetWidth;
        badge.classList.add('pop');
    });
}

// 1. Function called when clicking "Add to Cart"
function addToCart() {
    const size = sizeSelect?.value || 'Medium';
    const milk = milkSelect?.value || 'Whole Milk';
    const sugar = sugarSlider?.value || '2';
    const priceText = priceDisplay?.textContent || '₱140.00';
    const numericPrice = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 140;

    const orderItem = {
        id: Date.now(),
        name: 'Customized Drink',
        size: size,
        milk: milk,
        sugar: sugar,
        price: numericPrice,
        quantity: 1
    };

    window.cart.push(orderItem);
    localStorage.setItem('brewHavenCart', JSON.stringify(window.cart));

    updateCartBadge();

    console.log('Item added to cart:', orderItem);

    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = 'Item added to cart!';
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    setTimeout(() => {
        window.location.href = 'index.html#main-feature';
    }, 1000);
}

function updatePrice() {
    if (!sizeSelect || !milkSelect || !priceDisplay) return;
    const size = sizeSelect.value;
    const milk = milkSelect.value;
    const addonSize = sizeAddons[size] || 0;
    const addonMilk = milkAddons[milk] || 0;
    const finalPrice = (basePrice + addonSize + addonMilk).toFixed(2);
    priceDisplay.textContent = `₱${finalPrice}`;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    sizeSelect = document.getElementById('size-select');
    milkSelect = document.getElementById('milk-select');
    sugarSlider = document.getElementById('sugar-slider');
    priceDisplay = document.getElementById('price-display');
    itemTitle = document.getElementById('itemTitle');

    const urlParams = new URLSearchParams(window.location.search);
    const itemName = urlParams.get('item') || 'Coffee';
    const itemPrice = parseFloat(urlParams.get('price')) || 140.00;
    basePrice = itemPrice;

    if (itemTitle) itemTitle.textContent = `Customize Your ${itemName}`;
    if (priceDisplay) priceDisplay.textContent = `₱${basePrice.toFixed(2)}`;

    if (sizeSelect) sizeSelect.addEventListener('change', updatePrice);
    if (milkSelect) milkSelect.addEventListener('change', updatePrice);

    updatePrice();

    // Load cart from localStorage
    window.cart = JSON.parse(localStorage.getItem('brewHavenCart')) || [];
    updateCartBadge();

    if (sugarSlider) {
        const sugarValue = document.getElementById('sugarValue');
        sugarSlider.addEventListener('input', () => {
            if (sugarValue) sugarValue.textContent = sugarSlider.value;
        });
    }
});