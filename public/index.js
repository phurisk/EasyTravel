// Cart functionality
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateCartUI();
        this.initNavigation();
    }

    bindEvents() {
        // Cart toggle
        const cartBtn = document.getElementById('cart-btn');
        const cartClose = document.getElementById('cart-close');
        const cartOverlay = document.getElementById('cart-overlay');
        const checkoutBtn = document.getElementById('checkout-btn');

        if (cartBtn) {
            cartBtn.addEventListener('click', () => this.toggleCart());
        }

        if (cartClose) {
            cartClose.addEventListener('click', () => this.closeCart());
        }

        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => this.closeCart());
        }

        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.checkout());
        }

        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-card')) {
                e.preventDefault();
                const card = e.target.closest('.destination-card');
                this.addToCart(card);
            }
        });

        // Search form
        const searchForm = document.getElementById('search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSearch();
            });
        }
    }

    initNavigation() {
        // Mobile navigation toggle
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking on links
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav-link')) {
                navToggle?.classList.remove('active');
                navMenu?.classList.remove('active');
            }
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (window.scrollY > 100) {
                    navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                    navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
                } else {
                    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                    navbar.style.boxShadow = 'none';
                }
            }
        });
    }

    addToCart(cardElement) {
        const destination = cardElement.dataset.destination;
        const title = cardElement.querySelector('h3').textContent;
        const subtitle = cardElement.querySelector('h4').textContent;
        const price = cardElement.querySelector('.card-price').textContent;
        const image = cardElement.querySelector('img').src;

        const item = {
            id: destination,
            name: `${title} - ${subtitle}`,
            price: this.extractPrice(price),
            image: image,
            quantity: 1
        };

        const existingItem = this.items.find(i => i.id === item.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
            this.showNotification('เพิ่มจำนวนสินค้าในตะกร้าแล้ว', 'success');
        } else {
            this.items.push(item);
            this.showNotification('เพิ่มสินค้าในตะกร้าแล้ว', 'success');
        }

        this.saveCart();
        this.updateCartUI();
        this.openCart();
    }

    removeFromCart(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartUI();
        this.showNotification('ลบสินค้าออกจากตะกร้าแล้ว', 'info');
    }

    updateQuantity(itemId, newQuantity) {
        const item = this.items.find(i => i.id === itemId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeFromCart(itemId);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
                this.updateCartUI();
            }
        }
    }

    updateCartUI() {
        const cartCount = document.getElementById('cart-count');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');

        if (cartCount) {
            const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }

        if (cartItems) {
            cartItems.innerHTML = '';
            
            if (this.items.length === 0) {
                cartItems.innerHTML = '<li class="empty-cart">ตะกร้าสินค้าว่าง</li>';
            } else {
                this.items.forEach(item => {
                    const li = document.createElement('li');
                    li.className = 'cart-item';
                    li.innerHTML = `
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-item-info">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">฿${item.price.toLocaleString()}</div>
                        </div>
                        <div class="cart-item-controls">
                            <button onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantity">${item.quantity}</span>
                            <button onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">
                                <i class="fas fa-plus"></i>
                            </button>
                            <button onclick="cart.removeFromCart('${item.id}')" class="remove-btn">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                    cartItems.appendChild(li);
                });
            }
        }

        if (cartTotal) {
            const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = total.toLocaleString();
        }
    }

    toggleCart() {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.toggle('active');
            cartOverlay.classList.toggle('active');
            document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
        }
    }

    openCart() {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeCart() {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    checkout() {
        if (this.items.length === 0) {
            this.showNotification('ตะกร้าสินค้าว่าง', 'warning');
            return;
        }
        
        // Store cart data for payment page
        localStorage.setItem('checkoutItems', JSON.stringify(this.items));
        window.location.href = 'payment.html';
    }

    handleSearch() {
        const destination = document.getElementById('destination').value;
        const departure = document.getElementById('departure').value;
        const returnDate = document.getElementById('return').value;
        const passengers = document.getElementById('passengers').value;

        if (!destination.trim()) {
            this.showNotification('กรุณาระบุปลายทาง', 'warning');
            return;
        }

        if (!departure) {
            this.showNotification('กรุณาเลือกวันออกเดินทาง', 'warning');
            return;
        }

        // Store search data
        const searchData = {
            destination,
            departure,
            return: returnDate,
            passengers
        };
        
        localStorage.setItem('searchData', JSON.stringify(searchData));
        this.showNotification('กำลังค้นหาเที่ยวบิน...', 'info');
        
        setTimeout(() => {
            window.location.href = 'flights.html';
        }, 1000);
    }

    extractPrice(priceString) {
        return parseInt(priceString.replace(/[^\d]/g, '')) || 0;
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#3498db'
        };
        return colors[type] || '#3498db';
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cart = new ShoppingCart();
    
    // Set minimum date for date inputs
    const today = new Date().toISOString().split('T')[0];
    const departureInput = document.getElementById('departure');
    const returnInput = document.getElementById('return');
    
    if (departureInput) {
        departureInput.min = today;
        departureInput.addEventListener('change', () => {
            if (returnInput) {
                returnInput.min = departureInput.value;
            }
        });
    }
    
    if (returnInput) {
        returnInput.min = today;
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading animation to destination cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.destination-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});