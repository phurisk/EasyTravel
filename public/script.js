// Flight data
const flightData = [
    {
        id: 'sg001',
        airline: 'Singapore Airlines',
        flightNumber: 'SQ 001',
        route: {
            from: { city: 'กรุงเทพฯ', airport: 'BKK', time: '08:30' },
            to: { city: 'สิงคโปร์', airport: 'SIN', time: '11:45' },
            duration: '3ช 15น'
        },
        price: 12000,
        features: ['อาหารฟรี', 'Wi-Fi', 'บันเทิง'],
        image: './image/SG.png'
    },
    {
        id: 'jp002',
        airline: 'Japan Airlines',
        flightNumber: 'JL 708',
        route: {
            from: { city: 'กรุงเทพฯ', airport: 'BKK', time: '14:20' },
            to: { city: 'โตเกียว', airport: 'NRT', time: '22:10' },
            duration: '6ช 50น'
        },
        price: 25000,
        features: ['อาหารฟรี', 'Wi-Fi', 'บันเทิง', 'USB'],
        image: './image/Fuji.PNG'
    },
    {
        id: 'it003',
        airline: 'Alitalia',
        flightNumber: 'AZ 785',
        route: {
            from: { city: 'กรุงเทพฯ', airport: 'BKK', time: '23:45' },
            to: { city: 'โรม', airport: 'FCO', time: '06:30+1' },
            duration: '11ช 45น'
        },
        price: 35000,
        features: ['อาหารฟรี', 'Wi-Fi', 'บันเทิง', 'USB', 'เบาะนอน'],
        image: './image/Roman.png'
    },
    {
        id: 'mv004',
        airline: 'Maldivian',
        flightNumber: 'Q2 501',
        route: {
            from: { city: 'กรุงเทพฯ', airport: 'BKK', time: '16:15' },
            to: { city: 'มาเล', airport: 'MLE', time: '19:30' },
            duration: '4ช 15น'
        },
        price: 28000,
        features: ['อาหารฟรี', 'Wi-Fi', 'บันเทิง'],
        image: './image/Mal.png'
    },
    {
        id: 'fi005',
        airline: 'Finnair',
        flightNumber: 'AY 139',
        route: {
            from: { city: 'กรุงเทพฯ', airport: 'BKK', time: '01:25' },
            to: { city: 'เฮลซิงกิ', airport: 'HEL', time: '06:45' },
            duration: '9ช 20น'
        },
        price: 32000,
        features: ['อาหารฟรี', 'Wi-Fi', 'บันเทิง', 'USB'],
        image: './image/NN.png'
    },
    {
        id: 'th006',
        airline: 'Thai Airways',
        flightNumber: 'TG 415',
        route: {
            from: { city: 'กรุงเทพฯ', airport: 'BKK', time: '12:40' },
            to: { city: 'ภูเก็ต', airport: 'HKT', time: '14:05' },
            duration: '1ช 25น'
        },
        price: 8500,
        features: ['อาหารฟรี', 'บันเทิง'],
        image: './image/PP.png'
    }
];

// Flight booking system
class FlightBooking {
    constructor() {
        this.flights = flightData;
        this.cart = JSON.parse(localStorage.getItem('flightCart')) || [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderFlights();
        this.updateCartUI();
        this.initNavigation();
        this.loadSearchData();
    }

    bindEvents() {
        // Cart functionality
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

        // Sort functionality
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortFlights(e.target.value);
            });
        }

        // Flight selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-select')) {
                e.preventDefault();
                const flightCard = e.target.closest('.flight-card');
                const flightId = flightCard.dataset.flightId;
                this.selectFlight(flightId);
            }

            if (e.target.closest('.btn-details')) {
                e.preventDefault();
                const flightCard = e.target.closest('.flight-card');
                const flightId = flightCard.dataset.flightId;
                this.showFlightDetails(flightId);
            }
        });
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

    loadSearchData() {
        const searchData = JSON.parse(localStorage.getItem('searchData'));
        if (searchData) {
            // You could filter flights based on search criteria here
            console.log('Search data:', searchData);
        }
    }

    renderFlights() {
        const flightsGrid = document.getElementById('flights-grid');
        if (!flightsGrid) return;

        if (this.flights.length === 0) {
            flightsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-plane-slash"></i>
                    <h3>ไม่พบเที่ยวบิน</h3>
                    <p>ลองเปลี่ยนเงื่อนไขการค้นหาของคุณ</p>
                </div>
            `;
            return;
        }

        flightsGrid.innerHTML = this.flights.map(flight => `
            <div class="flight-card" data-flight-id="${flight.id}">
                <div class="flight-header">
                    <div class="flight-info">
                        <h3>${flight.airline}</h3>
                        <p>เที่ยวบิน ${flight.flightNumber}</p>
                    </div>
                    <div class="flight-price">
                        <p class="price-amount">฿${flight.price.toLocaleString()}</p>
                        <p class="price-label">ต่อคน</p>
                    </div>
                </div>
                
                <div class="flight-details">
                    <div class="flight-route">
                        <div class="route-point">
                            <div class="route-time">${flight.route.from.time}</div>
                            <div class="route-location">${flight.route.from.city}</div>
                            <div class="route-airport">${flight.route.from.airport}</div>
                        </div>
                        
                        <div class="route-line">
                            <div class="route-duration">${flight.route.duration}</div>
                        </div>
                        
                        <div class="route-point">
                            <div class="route-time">${flight.route.to.time}</div>
                            <div class="route-location">${flight.route.to.city}</div>
                            <div class="route-airport">${flight.route.to.airport}</div>
                        </div>
                    </div>
                    
                    <div class="flight-meta">
                        <div class="flight-features">
                            ${flight.features.map(feature => `
                                <div class="feature">
                                    <i class="fas fa-check"></i>
                                    <span>${feature}</span>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="flight-actions">
                            <button class="btn-details">รายละเอียด</button>
                            <button class="btn-select">เลือกเที่ยวบิน</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    sortFlights(criteria) {
        switch (criteria) {
            case 'price':
                this.flights.sort((a, b) => a.price - b.price);
                break;
            case 'duration':
                this.flights.sort((a, b) => {
                    const aDuration = this.parseDuration(a.route.duration);
                    const bDuration = this.parseDuration(b.route.duration);
                    return aDuration - bDuration;
                });
                break;
            case 'departure':
                this.flights.sort((a, b) => {
                    const aTime = this.parseTime(a.route.from.time);
                    const bTime = this.parseTime(b.route.from.time);
                    return aTime - bTime;
                });
                break;
        }
        this.renderFlights();
    }

    parseDuration(duration) {
        const hours = duration.match(/(\d+)ช/);
        const minutes = duration.match(/(\d+)น/);
        return (hours ? parseInt(hours[1]) : 0) * 60 + (minutes ? parseInt(minutes[1]) : 0);
    }

    parseTime(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    selectFlight(flightId) {
        const flight = this.flights.find(f => f.id === flightId);
        if (!flight) return;

        const existingItem = this.cart.find(item => item.id === flightId);
        
        if (existingItem) {
            existingItem.quantity += 1;
            this.showNotification('เพิ่มจำนวนเที่ยวบินในตะกร้าแล้ว', 'success');
        } else {
            const cartItem = {
                id: flight.id,
                name: `${flight.airline} - ${flight.flightNumber}`,
                route: `${flight.route.from.city} → ${flight.route.to.city}`,
                time: `${flight.route.from.time} - ${flight.route.to.time}`,
                price: flight.price,
                image: flight.image,
                quantity: 1
            };
            
            this.cart.push(cartItem);
            this.showNotification('เพิ่มเที่ยวบินในตะกร้าแล้ว', 'success');
        }

        this.saveCart();
        this.updateCartUI();
        this.openCart();
    }

    showFlightDetails(flightId) {
        const flight = this.flights.find(f => f.id === flightId);
        if (!flight) return;

        // Create modal for flight details
        const modal = document.createElement('div');
        modal.className = 'flight-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${flight.airline} - ${flight.flightNumber}</h3>
                        <button class="modal-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="flight-route-detail">
                            <div class="route-info">
                                <h4>เส้นทางการบิน</h4>
                                <p>${flight.route.from.city} (${flight.route.from.airport}) → ${flight.route.to.city} (${flight.route.to.airport})</p>
                                <p>ระยะเวลา: ${flight.route.duration}</p>
                            </div>
                            <div class="flight-features-detail">
                                <h4>สิ่งอำนวยความสะดวก</h4>
                                <ul>
                                    ${flight.features.map(feature => `<li>${feature}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="price-info">
                                <h4>ราคา</h4>
                                <p class="price-large">฿${flight.price.toLocaleString()} ต่อคน</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" onclick="flightBooking.selectFlight('${flight.id}'); this.closest('.flight-modal').remove();">
                            เลือกเที่ยวบินนี้
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
        `;

        document.body.appendChild(modal);

        // Close modal events
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                modal.remove();
            }
        });
    }

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartUI();
        this.showNotification('ลบเที่ยวบินออกจากตะกร้าแล้ว', 'info');
    }

    updateQuantity(itemId, newQuantity) {
        const item = this.cart.find(i => i.id === itemId);
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
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }

        if (cartItems) {
            cartItems.innerHTML = '';
            
            if (this.cart.length === 0) {
                cartItems.innerHTML = '<li class="empty-cart">ตะกร้าสินค้าว่าง</li>';
            } else {
                this.cart.forEach(item => {
                    const li = document.createElement('li');
                    li.className = 'cart-item';
                    li.innerHTML = `
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-item-info">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-route">${item.route}</div>
                            <div class="cart-item-time">${item.time}</div>
                            <div class="cart-item-price">฿${item.price.toLocaleString()}</div>
                        </div>
                        <div class="cart-item-controls">
                            <button onclick="flightBooking.updateQuantity('${item.id}', ${item.quantity - 1})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantity">${item.quantity}</span>
                            <button onclick="flightBooking.updateQuantity('${item.id}', ${item.quantity + 1})">
                                <i class="fas fa-plus"></i>
                            </button>
                            <button onclick="flightBooking.removeFromCart('${item.id}')" class="remove-btn">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                    cartItems.appendChild(li);
                });
            }
        }

        if (cartTotal) {
            const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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
        if (this.cart.length === 0) {
            this.showNotification('ตะกร้าสินค้าว่าง', 'warning');
            return;
        }
        
        // Store cart data for payment page
        localStorage.setItem('checkoutItems', JSON.stringify(this.cart));
        window.location.href = 'payment.html';
    }

    saveCart() {
        localStorage.setItem('flightCart', JSON.stringify(this.cart));
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

// Initialize flight booking system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.flightBooking = new FlightBooking();
});