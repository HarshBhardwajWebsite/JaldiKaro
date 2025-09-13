// Main JavaScript file for Jaldikaro
class Jaldikaro {
    constructor() {
        this.currentStep = 1;
        this.bookingData = {
            phone: '',
            location: {
                pinCode: '',
                address: '',
                lat: null,
                lng: null
            },
            service: null
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadServices();
        this.checkGeolocationSupport();
    }
    
    bindEvents() {
        // Mobile menu toggle
        document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
            const mobileMenu = document.getElementById('mobileMenu');
            mobileMenu.classList.toggle('hidden');
        });
        
        // Start booking button
        document.getElementById('startBookingBtn')?.addEventListener('click', () => {
            this.scrollToBooking();
        });
        
        // Emergency buttons
        document.getElementById('emergencyBtn')?.addEventListener('click', () => {
            this.handleEmergency();
        });
        
        document.getElementById('emergencyFloatingBtn')?.addEventListener('click', () => {
            this.handleEmergency();
        });
        
        // Navigation buttons
        document.getElementById('loginBtn')?.addEventListener('click', () => {
            this.showLogin();
        });
        
        document.getElementById('loginBtnMobile')?.addEventListener('click', () => {
            this.showLogin();
        });
        
        document.getElementById('adminBtn')?.addEventListener('click', () => {
            this.showAdmin();
        });
        
        document.getElementById('adminBtnMobile')?.addEventListener('click', () => {
            this.showAdmin();
        });
        
        document.getElementById('joinProviderBtn')?.addEventListener('click', () => {
            this.showProviderOnboarding();
        });
        
        document.getElementById('viewAllServicesBtn')?.addEventListener('click', () => {
            this.showAllServices();
        });
        
        // Show emergency button on scroll
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY > 500;
            const emergencyBtn = document.getElementById('emergencyFloatingBtn');
            if (scrolled) {
                emergencyBtn?.classList.remove('hidden');
            } else {
                emergencyBtn?.classList.add('hidden');
            }
        });
    }
    
    scrollToBooking() {
        const bookingSection = document.getElementById('bookingFlow');
        bookingSection?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
        
        // Focus on phone input
        setTimeout(() => {
            document.getElementById('phoneInput')?.focus();
        }, 500);
    }
    
    async loadServices() {
        try {
            // Load services from API or use default services
            const services = await this.getServices();
            this.renderServicesPreview(services);
        } catch (error) {
            console.error('Error loading services:', error);
            this.renderServicesPreview(this.getDefaultServices());
        }
    }
    
    getDefaultServices() {
        return [
            { id: '1', name_en: 'Carpenter', name_hi: 'बढ़ई', category: 'carpenter', base_price: 299, icon: 'fas fa-hammer' },
            { id: '2', name_en: 'Electrician', name_hi: 'बिजलीवाला', category: 'electrician', base_price: 249, icon: 'fas fa-bolt' },
            { id: '3', name_en: 'Plumber', name_hi: 'नलकार', category: 'plumber', base_price: 199, icon: 'fas fa-wrench' },
            { id: '4', name_en: 'Pandit', name_hi: 'पंडित', category: 'pandit', base_price: 501, icon: 'fas fa-pray' },
            { id: '5', name_en: 'Cleaner', name_hi: 'सफाई करने वाला', category: 'cleaner', base_price: 149, icon: 'fas fa-broom' },
            { id: '6', name_en: 'Painter', name_hi: 'रंगसाज़', category: 'painter', base_price: 399, icon: 'fas fa-paint-roller' },
            { id: '7', name_en: 'Appliance Repair', name_hi: 'उपकरण मरम्मत', category: 'appliance_repair', base_price: 299, icon: 'fas fa-tools' },
            { id: '8', name_en: 'Pest Control', name_hi: 'कीट नियंत्रण', category: 'pest_control', base_price: 499, icon: 'fas fa-bug' },
            { id: '9', name_en: 'Gardening', name_hi: 'बागवानी', category: 'gardening', base_price: 199, icon: 'fas fa-seedling' },
            { id: '10', name_en: 'Security', name_hi: 'सुरक्षा', category: 'security', base_price: 799, icon: 'fas fa-shield-alt' }
        ];
    }
    
    async getServices() {
        try {
            const response = await fetch('tables/services');
            const result = await response.json();
            return result.data || this.getDefaultServices();
        } catch (error) {
            return this.getDefaultServices();
        }
    }
    
    renderServicesPreview(services) {
        const container = document.getElementById('servicesPreview');
        if (!container) return;
        
        const previewServices = services.slice(0, 6); // Show first 6 services
        
        container.innerHTML = previewServices.map(service => `
            <div class="service-card bg-white border border-gray-200 rounded-xl p-6 text-center hover:border-orange-200 cursor-pointer">
                <div class="text-3xl mb-3 text-orange-500">
                    <i class="${service.icon}"></i>
                </div>
                <h3 class="font-bold text-gray-800 mb-1">${service.name_en}</h3>
                <p class="text-sm text-gray-600 mb-2">₹${service.base_price}+</p>
                <button onclick="app.selectServiceAndStart('${service.id}')" class="text-orange-500 hover:text-orange-600 font-medium text-sm">
                    Book Now →
                </button>
            </div>
        `).join('');
    }
    
    selectServiceAndStart(serviceId) {
        // Pre-select the service and scroll to booking
        this.bookingData.service = serviceId;
        this.scrollToBooking();
    }
    
    checkGeolocationSupport() {
        if (!navigator.geolocation) {
            const detectBtn = document.getElementById('detectLocationBtn');
            if (detectBtn) {
                detectBtn.textContent = 'Geolocation not supported';
                detectBtn.disabled = true;
                detectBtn.classList.add('bg-gray-400', 'cursor-not-allowed');
            }
        }
    }
    
    handleEmergency() {
        // Show emergency modal or redirect to emergency page
        alert('Emergency services coming soon! For immediate help, please call: +91 9876543210');
    }
    
    showLogin() {
        // Redirect to login page or show login modal
        window.location.href = 'login.html';
    }
    
    showAdmin() {
        // Redirect to admin dashboard
        window.location.href = 'admin.html';
    }
    
    showProviderOnboarding() {
        // Redirect to provider onboarding
        window.location.href = 'provider-signup.html';
    }
    
    showAllServices() {
        // Redirect to services page
        window.location.href = 'services.html';
    }
    
    // Utility methods
    formatPhone(phone) {
        return phone.replace(/\D/g, '').slice(0, 10);
    }
    
    validatePhone(phone) {
        return /^[6-9]\d{9}$/.test(phone);
    }
    
    validatePinCode(pinCode) {
        return /^\d{6}$/.test(pinCode);
    }
    
    // Analytics and tracking
    trackEvent(eventName, eventData = {}) {
        // Google Analytics or other tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }
        console.log('Event tracked:', eventName, eventData);
    }
    
    // PWA functionality
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered:', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed:', registrationError);
                });
        }
    }
}

// Global app instance
const app = new Jaldikaro();

// PWA install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install button
    const installBtn = document.getElementById('installBtn');
    if (installBtn) {
        installBtn.style.display = 'block';
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`User response to the install prompt: ${outcome}`);
                deferredPrompt = null;
                installBtn.style.display = 'none';
            }
        });
    }
});

// Handle app install
window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    app.trackEvent('pwa_installed');
});

// Performance monitoring
window.addEventListener('load', () => {
    // Register service worker
    app.registerServiceWorker();
    
    // Track page load time
    const loadTime = performance.now();
    app.trackEvent('page_load_time', { load_time: Math.round(loadTime) });
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    app.trackEvent('javascript_error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno
    });
});

// Export for other modules
window.app = app;