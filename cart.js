// cart.js - Handles cart and checkout functionality

document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cartItems');
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');
    const cartCountEl = document.getElementById('cartCount');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const checkoutModal = document.getElementById('checkoutModal');
    const orderSummaryEl = document.getElementById('orderSummary');
    const pickupTimeEl = document.getElementById('pickupTime');

    // Load cart from localStorage
    let cart = JSON.parse(localStorage.getItem('brewHavenCart')) || [];

    // Update cart count badge
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEl.textContent = totalItems;
    }

    // Render cart items
    function renderCart() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            updateTotals();
            updateCartCount();
            return;
        }

        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>${item.size.charAt(0).toUpperCase() + item.size.slice(1)} | ${item.milk.charAt(0).toUpperCase() + item.milk.slice(1)} Milk | Sugar: ${item.sugar}</p>
                </div>
                <div class="item-price">₱${item.price.toFixed(2)}</div>
                <div class="item-quantity">
                    <button class="qty-btn minus" data-id="${item.id}">-</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn plus" data-id="${item.id}">+</button>
                </div>
                <button class="remove-btn" data-id="${item.id}">Remove</button>
            </div>
        `).join('');

        // Add event listeners for quantity and remove buttons
        document.querySelectorAll('.qty-btn.minus').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                const item = cart.find(i => i.id === id);
                if (item && item.quantity > 1) {
                    item.quantity--;
                    saveCart();
                    renderCart();
                }
            });
        });

        document.querySelectorAll('.qty-btn.plus').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                const item = cart.find(i => i.id === id);
                if (item) {
                    item.quantity++;
                    saveCart();
                    renderCart();
                }
            });
        });

        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                cart = cart.filter(i => i.id !== id);
                saveCart();
                renderCart();
            });
        });

        updateTotals();
        updateCartCount();
    }

    // Update totals: remove tax, total = subtotal
    function updateTotals() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        subtotalEl.textContent = `₱${subtotal.toFixed(2)}`;
        taxEl.textContent = `₱0.00`;
        totalEl.textContent = `₱${subtotal.toFixed(2)}`;
    }

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('brewHavenCart', JSON.stringify(cart));
    }

    // Checkout functionality
    checkoutBtn.addEventListener('click', () => {
        const emptyMsg = document.getElementById('emptyCartMsg');
        if (cart.length === 0) {
            emptyMsg.textContent = 'Cart is empty';
            emptyMsg.classList.add('show');
            return;
        }
        emptyMsg.textContent = '';
        emptyMsg.classList.remove('show');

        // Calculate estimated pickup time (current time + 15 minutes)
        const now = new Date();
        const pickup = new Date(now.getTime() + 15 * 60000);
        const pickupTimeStr = pickup.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        pickupTimeEl.textContent = pickupTimeStr;

        // Build order summary
        let summaryHTML = '<ul>';
        let total = 0;
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            summaryHTML += `<li>${item.name} (${item.size}, ${item.milk} milk, sugar: ${item.sugar}) x${item.quantity} - ₱${itemTotal.toFixed(2)}</li>`;
        });
        summaryHTML += '</ul>';
        orderSummaryEl.innerHTML = summaryHTML;

        // Add payment method display
        const paymentMethod = 'GCash / Maya / Cash on Pickup';
        const paymentEl = document.createElement('p');
        paymentEl.className = 'payment-method';
        paymentEl.textContent = `Payment Method: ${paymentMethod}`;
        orderSummaryEl.appendChild(paymentEl);

        // Calculate total paid (no tax)
        const finalTotal = total;
        document.getElementById('totalPaid').textContent = `₱${finalTotal.toFixed(2)}`;

        // Reset cart
        cart = [];
        saveCart();
        renderCart();

        // Show modal
        checkoutModal.classList.add('show');
    });

    // Close modal and redirect to menu
    document.getElementById('backToMenuBtn').addEventListener('click', () => {
        checkoutModal.classList.remove('show');
        window.location.href = 'index.html#main-feature';
    });

    // View receipt
    document.getElementById('viewReceiptBtn').addEventListener('click', () => {
        window.print();
    });

    // Initial render
    renderCart();
});