// cart.js - Handles cart and checkout functionality

document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cartItems');
    const subtotalEl = document.getElementById('subtotal');
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
        if (cartCountEl) cartCountEl.textContent = totalItems;
        const badges = document.querySelectorAll('#global-cart-badge, .cart-badge, .cart-count, span[id*="badge"]');
        badges.forEach(badge => {
            badge.innerHTML = totalItems.toString();
            badge.textContent = totalItems.toString();
        });
    }

    // Render cart items
    function renderCart() {
        if (!cartItemsContainer) return;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align: center; padding: 2.5rem 1rem; color: var(--espresso-muted); font-size: 1.1rem;">Your cart is empty. Explore our menu and add some delicious handcrafted brews!</p>';
            updateTotals();
            updateCartCount();
            return;
        }

        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>${item.size.charAt(0).toUpperCase() + item.size.slice(1)} | ${item.milk.charAt(0).toUpperCase() + item.milk.slice(1)} | Sugar: ${item.sugar}</p>
                </div>
                <div class="item-price">₱${item.price.toFixed(2)}</div>
                <div class="item-quantity">
                    <button class="qty-btn minus" data-id="${item.id}" aria-label="Decrease quantity">-</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
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

    // Update totals: no tax, total = subtotal
    function updateTotals() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (subtotalEl) subtotalEl.textContent = `₱${subtotal.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `₱${subtotal.toFixed(2)}`;
    }

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('brewHavenCart', JSON.stringify(cart));
    }

    // Checkout functionality
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const emptyMsg = document.getElementById('emptyCartMsg');
            if (cart.length === 0) {
                if (emptyMsg) {
                    emptyMsg.textContent = 'Your cart is empty. Please add items to checkout.';
                }
                return;
            }
            if (emptyMsg) {
                emptyMsg.textContent = '';
            }

            // Get current user
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            const customerName = currentUser ? currentUser.username : 'Guest';

            // Calculate total (no tax)
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            // Create order object
            const orderId = 'BH-' + Date.now();
            const now = new Date();
            const orderTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const order = {
                orderId: orderId,
                customerName: customerName,
                items: cart.map(item => `${item.name} (${item.size}, ${item.milk}, sugar: ${item.sugar}) x${item.quantity}`),
                totalPrice: total,
                orderTime: orderTime,
                status: 'Pending'
            };

            // Save to localStorage allOrders
            let allOrders = JSON.parse(localStorage.getItem('allOrders')) || [];
            allOrders.push(order);
            localStorage.setItem('allOrders', JSON.stringify(allOrders));

            // Calculate estimated pickup time (current time + 15 minutes)
            const pickup = new Date(now.getTime() + 15 * 60000);
            const pickupTimeStr = pickup.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            if (pickupTimeEl) pickupTimeEl.textContent = pickupTimeStr;

            // Build order summary
            let summaryHTML = '<ul style="list-style: none; padding: 0;">';
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                summaryHTML += `<li style="padding: 4px 0; border-bottom: 1px dashed rgba(56,28,9,0.15);"><strong>${item.name}</strong> (${item.size}, ${item.milk}, sugar: ${item.sugar}) x${item.quantity} - ₱${itemTotal.toFixed(2)}</li>`;
            });
            summaryHTML += '</ul>';
            if (orderSummaryEl) orderSummaryEl.innerHTML = summaryHTML;

            // Add payment method display
            const paymentMethod = 'GCash / Maya / Cash on Pickup';
            const paymentEl = document.createElement('p');
            paymentEl.className = 'payment-method';
            paymentEl.style.marginTop = '8px';
            paymentEl.style.fontWeight = '600';
            paymentEl.textContent = `Payment Method: ${paymentMethod}`;
            if (orderSummaryEl) orderSummaryEl.appendChild(paymentEl);

            // Calculate total paid (no tax)
            const totalPaidEl = document.getElementById('totalPaid');
            if (totalPaidEl) totalPaidEl.textContent = `₱${total.toFixed(2)}`;

            // Reset cart
            cart = [];
            saveCart();
            renderCart();

            // Show modal
            if (checkoutModal) checkoutModal.classList.add('show');
        });
    }

    // Close modal and redirect to menu
    const backToMenuBtn = document.getElementById('backToMenuBtn');
    if (backToMenuBtn) {
        backToMenuBtn.addEventListener('click', () => {
            if (checkoutModal) checkoutModal.classList.remove('show');
            window.location.href = 'index.html#main-feature';
        });
    }

    // View receipt
    const viewReceiptBtn = document.getElementById('viewReceiptBtn');
    if (viewReceiptBtn) {
        viewReceiptBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // Initial render
    renderCart();
});
