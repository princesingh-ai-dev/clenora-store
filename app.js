// Clenora Store - E-commerce JavaScript

// Cart data
cart = [];

// DOM Elements
const cartOverlay = document.querySelector('.cart-overlay');
const cartSidebar = document.querySelector('.cart-sidebar');
const cartItemsContainer = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const cartTotal = document.querySelector('.cart-total .amount');
const notification = document.querySelector('.notification');
const checkoutForm = document.querySelector('.checkout-form');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    updateCartDisplay();
    setupEventListeners();
    setupSmoothScroll();
    setupMobileMenu();
});

// Event Listeners
function setupEventListeners() {
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = btn.getAttribute('data-id');
            const productName = btn.getAttribute('data-name');
            const productPrice = parseFloat(btn.getAttribute('data-price'));
            const productImage = btn.getAttribute('data-image');
            addToCart(productId, productName, productPrice, productImage);
        });
    });

    // Close cart
    document.querySelectorAll('.close-cart').forEach(btn => {
        btn.addEventListener('click', closeCart);
    });

    // Cart overlay click
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }

    // Checkout button
    const checkoutBtn = document.querySelector('.cart-checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            closeCart();
            goToCheckout();
        });
    }

    // Payment method selection
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', () => {
            document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
            method.classList.add('active');
        });
    });

    // Checkout form submission
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }

    // Smooth scroll for nav links
    document.querySelectorAll('.nav-links a, .hero-btn').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// Smooth Scroll Setup
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Mobile Menu
function setupMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}

// Cart Functions
function addToCart(id, name, price, image) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }
    saveCart();
    updateCartDisplay();
    showNotification(`"${name}" added to cart!`, 'success');
    openCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartDisplay();
}

function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            updateCartDisplay();
        }
    }
}

function saveCart() {
    localStorage.setItem('clenoraCart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('clenoraCart');
    if (saved) {
        cart = JSON.parse(saved);
    }
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// Update cart display
function updateCartDisplay() {
    // Update badge count
    if (cartCount) cartCount.textContent = getCartCount();

    // Update cart items
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">Rs ${item.price.toLocaleString()}</div>
                        <div class="quantity-controls">
                            <button type="button" class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                            <span>${item.quantity}</span>
                            <button type="button" class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                        </div>
                    </div>
                    <button type="button" class="remove-item" onclick="removeFromCart('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
        }
    }

    // Update total
    if (cartTotal) cartTotal.textContent = 'Rs ' + getCartTotal().toLocaleString();
}

// Open cart sidebar
function openCart() {
    if (cartOverlay && cartSidebar) {
        cartOverlay.classList.add('active');
        cartSidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close cart sidebar
function closeCart() {
    if (cartOverlay && cartSidebar) {
        cartOverlay.classList.remove('active');
        cartSidebar.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Go to checkout
function goToCheckout() {
    const checkoutSection = document.getElementById('checkout');
    if (checkoutSection) {
        checkoutSection.scrollIntoView({ behavior: 'smooth' });
        renderOrderSummary();
    }
}

// Render order summary on checkout
function renderOrderSummary() {
    const summaryContainer = document.getElementById('orderSummary');
    if (!summaryContainer || cart.length === 0) return;

    summaryContainer.innerHTML = cart.map(item => `
        <div class="order-item">
            <span>${item.name} x${item.quantity}</span>
            <span>Rs ${(item.price * item.quantity).toLocaleString()}</span>
        </div>
    `).join('') + `
        <div class="order-total">
            <span>Total</span>
            <span class="amount">Rs ${getCartTotal().toLocaleString()}</span>
        </div>
    `;
}

// Handle checkout
function handleCheckout(e) {
    e.preventDefault();
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;

    // Simulate payment processing
    setTimeout(() => {
        // Clear cart
        cart = [];
        saveCart();
        updateCartDisplay();

        // Reset form
        e.target.reset();
        document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));

        // Show success
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Order Placed!';
        submitBtn.style.background = 'var(--primary-green)';

        showNotification('Order placed successfully! Thank you for your purchase.', 'success');

        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 3000);
    }, 2000);
}

// Show notification
function showNotification(message, type = 'success') {
    if (notification) {
        notification.textContent = message;
        notification.className = 'notification ' + type;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Cart icon click in header
document.querySelector('.cart-icon')?.addEventListener('click', openCart);
