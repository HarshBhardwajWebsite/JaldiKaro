// Multi-language support for Jaldikaro
class LanguageManager {
    constructor() {
        this.currentLanguage = 'english';
        this.translations = {
            english: {
                // Navigation
                'services': 'Services',
                'how-it-works': 'How it Works',
                'become-provider': 'Become Provider',
                'login': 'Login',
                'admin': 'Admin',
                
                // Hero Section
                'hero-title': 'Services to your doorstep within 1–2 km',
                'hero-subtitle': 'Book in 3 clicks',
                'hero-description': 'Carpenter, electrician, pandit, plumber — verified local help at your door',
                'get-service-now': 'Get service now',
                'emergency': 'Emergency',
                'verified-providers': '500+ Verified Providers',
                'fast-service': 'Service in 30 mins',
                'rating': '4.8/5 Rating',
                
                // Booking Flow
                'enter-phone': 'Enter your phone number',
                'phone-description': 'We\'ll send you updates about your service',
                'continue': 'Continue',
                'privacy-note': 'Your number is safe with us. We follow strict privacy policies.',
                'enter-location': 'Enter your location',
                'location-description': 'Help us find the best providers near you',
                'detect-location': 'Use current location',
                'or': 'or',
                'back': 'Back',
                'choose-service': 'Choose your service',
                'service-description': 'Select the service you need',
                'find-providers': 'Find Providers',
                
                // Services
                'carpenter': 'Carpenter',
                'electrician': 'Electrician',
                'plumber': 'Plumber',
                'pandit': 'Pandit',
                'cleaner': 'Cleaner',
                'painter': 'Painter',
                
                // How It Works
                'how-it-works-title': 'How Jaldikaro Works',
                'how-it-works-subtitle': 'Get professional home services in just 3 simple steps',
                'step-1-title': '1. Book Service',
                'step-1-description': 'Enter your phone and location, choose your service',
                'step-2-title': '2. Get Matched',
                'step-2-description': 'We find verified providers within 1-2 km of your location',
                'step-3-title': '3. Service Done',
                'step-3-description': 'Provider arrives at your doorstep and completes the job',
                
                // Services Section
                'our-services': 'Our Services',
                'services-subtitle': 'Professional home services at your fingertips',
                'view-all-services': 'View All Services',
                
                // Provider CTA
                'become-provider-title': 'Become a Service Provider',
                'become-provider-subtitle': 'Join thousands of professionals earning with Jaldikaro',
                'join-as-provider': 'Join as Provider',
                'learn-more': 'Learn More',
                
                // Footer
                'footer-description': 'Your trusted partner for local home services within 1-2 km radius.',
                'company': 'Company',
                'about-us': 'About Us',
                'privacy-policy': 'Privacy Policy',
                'terms-conditions': 'Terms & Conditions',
                'contact': 'Contact',
                'contact-us': 'Contact Us'
            },
            hindi: {
                // Navigation
                'services': 'सेवाएं',
                'how-it-works': 'कैसे काम करता है',
                'become-provider': 'सेवा प्रदाता बनें',
                'login': 'लॉगिन',
                'admin': 'एडमिन',
                
                // Hero Section
                'hero-title': '1-2 किमी के भीतर आपके घर तक सेवाएं',
                'hero-subtitle': '3 क्लिक में बुक करें',
                'hero-description': 'बढ़ई, बिजलीवाला, पंडित, नलकार — आपके दरवाजे पर सत्यापित स्थानीय मदद',
                'get-service-now': 'अभी सेवा लें',
                'emergency': 'आपातकाल',
                'verified-providers': '500+ सत्यापित सेवा प्रदाता',
                'fast-service': '30 मिनट में सेवा',
                'rating': '4.8/5 रेटिंग',
                
                // Booking Flow
                'enter-phone': 'अपना फोन नंबर दर्ज करें',
                'phone-description': 'हम आपको आपकी सेवा के बारे में अपडेट भेजेंगे',
                'continue': 'जारी रखें',
                'privacy-note': 'आपका नंबर हमारे साथ सुरक्षित है। हम सख्त गोपनीयता नीतियों का पालन करते हैं।',
                'enter-location': 'अपना स्थान दर्ज करें',
                'location-description': 'आपके पास के सबसे अच्छे प्रदाताओं को खोजने में हमारी मदद करें',
                'detect-location': 'वर्तमान स्थान का उपयोग करें',
                'or': 'या',
                'back': 'वापस',
                'choose-service': 'अपनी सेवा चुनें',
                'service-description': 'आपको जिस सेवा की जरूरत है उसे चुनें',
                'find-providers': 'सेवा प्रदाता खोजें',
                
                // Services
                'carpenter': 'बढ़ई',
                'electrician': 'बिजलीवाला',
                'plumber': 'नलकार',
                'pandit': 'पंडित',
                'cleaner': 'सफाई करने वाला',
                'painter': 'रंगसाज़',
                
                // How It Works
                'how-it-works-title': 'जलदीकरो कैसे काम करता है',
                'how-it-works-subtitle': 'केवल 3 सरल चरणों में पेशेवर घरेलू सेवाएं प्राप्त करें',
                'step-1-title': '1. सेवा बुक करें',
                'step-1-description': 'अपना फोन और स्थान दर्ज करें, अपनी सेवा चुनें',
                'step-2-title': '2. मैच हो जाएं',
                'step-2-description': 'हम आपके स्थान के 1-2 किमी के भीतर सत्यापित प्रदाता खोजते हैं',
                'step-3-title': '3. सेवा पूरी',
                'step-3-description': 'सेवा प्रदाता आपके दरवाजे पर आता है और काम पूरा करता है',
                
                // Services Section
                'our-services': 'हमारी सेवाएं',
                'services-subtitle': 'आपकी उंगलियों पर पेशेवर घरेलू सेवाएं',
                'view-all-services': 'सभी सेवाएं देखें',
                
                // Provider CTA
                'become-provider-title': 'सेवा प्रदाता बनें',
                'become-provider-subtitle': 'जलदीकरो के साथ कमाने वाले हजारों पेशेवरों में शामिल हों',
                'join-as-provider': 'सेवा प्रदाता के रूप में जुड़ें',
                'learn-more': 'और जानें',
                
                // Footer
                'footer-description': '1-2 किमी त्रिज्या के भीतर स्थानीय घरेलू सेवाओं के लिए आपका विश्वसनीय साथी।',
                'company': 'कंपनी',
                'about-us': 'हमारे बारे में',
                'privacy-policy': 'गोपनीयता नीति',
                'terms-conditions': 'नियम और शर्तें',
                'contact': 'संपर्क',
                'contact-us': 'हमसे संपर्क करें'
            }
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadSavedLanguage();
    }
    
    bindEvents() {
        const toggleBtn = document.getElementById('languageToggle');
        toggleBtn?.addEventListener('click', () => {
            this.toggleLanguage();
        });
    }
    
    loadSavedLanguage() {
        const saved = localStorage.getItem('jaldikaro_language');
        if (saved && this.translations[saved]) {
            this.currentLanguage = saved;
        }
        this.updateUI();
    }
    
    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'english' ? 'hindi' : 'english';
        this.saveLanguage();
        this.updateUI();
        
        // Track language change
        app.trackEvent('language_changed', { language: this.currentLanguage });
    }
    
    saveLanguage() {
        localStorage.setItem('jaldikaro_language', this.currentLanguage);
    }
    
    updateUI() {\n        const elements = document.querySelectorAll('[data-lang]');\n        \n        elements.forEach(element => {\n            const key = element.getAttribute('data-lang');\n            const translation = this.translations[this.currentLanguage][key];\n            \n            if (translation) {\n                // Handle different element types\n                if (element.tagName === 'INPUT' && element.type !== 'button') {\n                    element.placeholder = translation;\n                } else {\n                    element.textContent = translation;\n                }\n            }\n        });\n        \n        // Update language toggle button\n        const currentLangEl = document.getElementById('currentLanguage');\n        if (currentLangEl) {\n            currentLangEl.textContent = this.currentLanguage === 'english' ? 'EN' : 'हि';\n        }\n        \n        // Update HTML lang attribute\n        const htmlEl = document.getElementById('html-root');\n        if (htmlEl) {\n            htmlEl.lang = this.currentLanguage === 'english' ? 'en' : 'hi';\n        }\n        \n        // Update document direction for Hindi (optional)\n        document.dir = this.currentLanguage === 'hindi' ? 'ltr' : 'ltr'; // Both are LTR\n    }\n    \n    getText(key) {\n        return this.translations[this.currentLanguage][key] || key;\n    }\n    \n    getCurrentLanguage() {\n        return this.currentLanguage;\n    }\n    \n    // Dynamic content translation\n    translateDynamicContent(content, targetLang = null) {\n        const lang = targetLang || this.currentLanguage;\n        \n        // This would integrate with a translation service like Google Translate API\n        // For now, return the content as-is\n        return content;\n    }\n    \n    // Format numbers and currencies based on language\n    formatCurrency(amount) {\n        if (this.currentLanguage === 'hindi') {\n            // Format for Indian locale\n            return new Intl.NumberFormat('hi-IN', {\n                style: 'currency',\n                currency: 'INR',\n                minimumFractionDigits: 0\n            }).format(amount);\n        } else {\n            return new Intl.NumberFormat('en-IN', {\n                style: 'currency',\n                currency: 'INR',\n                minimumFractionDigits: 0\n            }).format(amount);\n        }\n    }\n    \n    formatDate(date) {\n        const options = {\n            year: 'numeric',\n            month: 'long',\n            day: 'numeric'\n        };\n        \n        if (this.currentLanguage === 'hindi') {\n            return new Intl.DateTimeFormat('hi-IN', options).format(date);\n        } else {\n            return new Intl.DateTimeFormat('en-IN', options).format(date);\n        }\n    }\n    \n    formatTime(date) {\n        const options = {\n            hour: '2-digit',\n            minute: '2-digit'\n        };\n        \n        if (this.currentLanguage === 'hindi') {\n            return new Intl.DateTimeFormat('hi-IN', options).format(date);\n        } else {\n            return new Intl.DateTimeFormat('en-IN', options).format(date);\n        }\n    }\n}\n\n// Initialize language manager\nconst languageManager = new LanguageManager();\n\n// Export for global access\nwindow.languageManager = languageManager;