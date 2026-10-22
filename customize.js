// 1. Ensure global cart array
if (!window.cart) window.cart = [];

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

// 2. Direct function to sync the visible badge counter
function syncCartBadge() {
    const totalCount = window.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

    // Target ALL badge elements on the page simultaneously
    const badges = document.querySelectorAll('#global-cart-badge, .cart-badge, .cart-count, span[id*="badge"]');

    badges.forEach(badge => {
        badge.innerHTML = totalCount.toString();
        badge.textContent = totalCount.toString();
    });

    console.log('Cart Badge Updated to:', totalCount);
}

// 3. Add to Cart function
function addToCart() {
    // Get values from customization form
    const size = document.getElementById('size-select')?.value || 'Medium';
    const milk = document.getElementById('milk-select')?.value || 'Whole Milk';
    const sugar = document.getElementById('sugar-slider')?.value || '2';
    const priceText = document.getElementById('price-display')?.textContent || '₱140.00';

    const numericPrice = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 140;

    const newItem = {
        id: Date.now(),
        name: currentItemName,
        size: size,
        milk: milk,
        sugar: sugar,
        price: numericPrice,
        quantity: 1
    };

    // Add to global cart array
    window.cart.push(newItem);

    // Save to localStorage
    localStorage.setItem('brewHavenCart', JSON.stringify(window.cart));

    // FORCE IMMEDIATE BADGE UPDATE
    syncCartBadge();

    // Console debugging
    console.log('Item added to cart:', newItem);

    // Show toast
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = 'Item added to cart!';
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Return to main menu view
    setTimeout(() => {
        window.location.href = 'index.html#main-feature';
    }, 1000);

    // Run sync again after view transition just in case
    setTimeout(syncCartBadge, 50);
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
    console.log('Item name from URL:', itemName, 'Full search:', window.location.search);
    currentItemName = itemName;
    const itemPrice = parseFloat(urlParams.get('price')) || 140.00;
    basePrice = itemPrice;

    if (itemTitle) itemTitle.textContent = `Customize Your ${itemName}`;
    if (priceDisplay) priceDisplay.textContent = `₱${basePrice.toFixed(2)}`;

    if (sizeSelect) sizeSelect.addEventListener('change', updatePrice);
    if (milkSelect) milkSelect.addEventListener('change', updatePrice);

    updatePrice();

    // Load cart from localStorage
    window.cart = JSON.parse(localStorage.getItem('brewHavenCart')) || [];
    syncCartBadge();

    if (sugarSlider) {
        const sugarValue = document.getElementById('sugarValue');
        sugarSlider.addEventListener('input', () => {
            if (sugarValue) sugarValue.textContent = sugarSlider.value;
        });
    }
});