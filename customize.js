// customize.js - Handles drink customization page

document.addEventListener('DOMContentLoaded', () => {
    // Get item from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const itemName = urlParams.get('item') || 'Coffee';
    const basePrice = parseFloat(urlParams.get('price')) || 4.50;

    // Update title
    document.getElementById('itemTitle').textContent = `Customize Your ${itemName}`;

    // Price calculation
    const sizeSelect = document.getElementById('size');
    const milkSelect = document.getElementById('milk');
    const sugarSlider = document.getElementById('sugar');
    const sugarValue = document.getElementById('sugarValue');
    const priceDisplay = document.getElementById('priceDisplay');

    // Size price multipliers
    const sizeAddons = {
        small: 0,
        medium: 20,
        large: 35
    };

    // Milk price add-ons
    const milkAddons = {
        whole: 0,
        oat: 30,
        almond: 30,
        skim: 0
    };

    function updatePrice() {
        const size = sizeSelect.value;
        const milk = milkSelect.value;
        const addonSize = sizeAddons[size];
        const addonMilk = milkAddons[milk];
        const finalPrice = (basePrice + addonSize + addonMilk).toFixed(2);
        priceDisplay.textContent = `₱${finalPrice}`;
        return finalPrice;
    }

    // Update sugar value display
    sugarSlider.addEventListener('input', () => {
        sugarValue.textContent = sugarSlider.value;
    });

    // Update price on size/milk change
    sizeSelect.addEventListener('change', updatePrice);
    milkSelect.addEventListener('change', updatePrice);

    // Initial price
    updatePrice();

    // Handle form submission (Add to Cart)
    const form = document.getElementById('customizeForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const size = sizeSelect.value;
        const milk = milkSelect.value;
        const sugar = sugarSlider.value;
        const price = updatePrice();

        // Create cart item object
        const cartItem = {
            id: Date.now(),
            name: itemName,
            size: size,
            milk: milk,
            sugar: sugar,
            price: parseFloat(price),
            quantity: 1
        };

        // Get existing cart from localStorage
        let cart = JSON.parse(localStorage.getItem('brewHavenCart')) || [];
        cart.push(cartItem);
        localStorage.setItem('brewHavenCart', JSON.stringify(cart));

        // Show toast
        const toast = document.getElementById('toast');
        toast.textContent = 'Item added to cart!';
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);

        // Redirect to Main Feature section after short delay
        setTimeout(() => {
            window.location.href = 'index.html#main-feature';
        }, 1000);
    });
});