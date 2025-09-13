// Services management for Jaldikaro
class ServicesManager {
    constructor() {
        this.services = [];
        this.categories = [];
        this.init();
    }
    
    init() {
        this.loadServices();
    }
    
    async loadServices() {
        try {
            const response = await fetch('tables/services');
            const result = await response.json();
            this.services = result.data || this.getDefaultServices();
        } catch (error) {
            console.error('Error loading services:', error);
            this.services = this.getDefaultServices();
        }
        
        this.extractCategories();
    }
    
    getDefaultServices() {
        return [
            {
                id: '1',
                name_en: 'Carpenter',
                name_hi: 'बढ़ई',
                category: 'carpenter',
                description_en: 'Furniture repair, door/window fixing, wooden work',
                description_hi: 'फर्नीचर की मरम्मत, दरवाजा/खिड़की ठीक करना, लकड़ी का काम',
                base_price: 299,
                duration_minutes: 60,
                is_active: true,
                icon: 'fas fa-hammer'
            },
            {
                id: '2',
                name_en: 'Electrician',
                name_hi: 'बिजलीवाला',
                category: 'electrician',
                description_en: 'Wiring, switch/socket repair, appliance installation',
                description_hi: 'वायरिंग, स्विच/सॉकेट की मरम्मत, उपकरण स्थापना',
                base_price: 249,
                duration_minutes: 45,
                is_active: true,
                icon: 'fas fa-bolt'
            },
            {
                id: '3',
                name_en: 'Plumber',
                name_hi: 'नलकार',
                category: 'plumber',
                description_en: 'Pipe leakage, tap repair, bathroom fixtures',
                description_hi: 'पाइप लीकेज, नल की मरम्मत, बाथरूम फिक्स्चर',
                base_price: 199,
                duration_minutes: 60,
                is_active: true,
                icon: 'fas fa-wrench'
            },
            {
                id: '4',
                name_en: 'Pandit',
                name_hi: 'पंडित',
                category: 'pandit',
                description_en: 'Puja ceremonies, religious rituals, astrology consultation',
                description_hi: 'पूजा समारोह, धार्मिक अनुष्ठान, ज्योतिष परामर्श',
                base_price: 501,
                duration_minutes: 120,
                is_active: true,
                icon: 'fas fa-pray'
            },
            {
                id: '5',
                name_en: 'House Cleaner',
                name_hi: 'घर सफाई करने वाला',
                category: 'cleaner',
                description_en: 'Deep cleaning, regular cleaning, sanitization',
                description_hi: 'गहरी सफाई, नियमित सफाई, कीटाणुशोधन',
                base_price: 149,
                duration_minutes: 90,
                is_active: true,
                icon: 'fas fa-broom'
            },
            {
                id: '6',
                name_en: 'Painter',
                name_hi: 'रंगसाज़',
                category: 'painter',
                description_en: 'Wall painting, touch-up work, interior painting',
                description_hi: 'दीवार पेंटिंग, टच-अप का काम, इंटीरियर पेंटिंग',
                base_price: 399,
                duration_minutes: 180,
                is_active: true,
                icon: 'fas fa-paint-roller'
            },
            {
                id: '7',
                name_en: 'AC Technician',
                name_hi: 'एसी तकनीशियन',
                category: 'appliance_repair',
                description_en: 'AC installation, repair, maintenance, gas refill',
                description_hi: 'एसी स्थापना, मरम्मत, रखरखाव, गैस रिफिल',
                base_price: 299,
                duration_minutes: 90,
                is_active: true,
                icon: 'fas fa-snowflake'
            },
            {
                id: '8',
                name_en: 'Pest Control',
                name_hi: 'कीट नियंत्रण',
                category: 'pest_control',
                description_en: 'Cockroach, ant, termite treatment, general pest control',
                description_hi: 'तिलचट्टा, चींटी, दीमक उपचार, सामान्य कीट नियंत्रण',
                base_price: 499,
                duration_minutes: 120,
                is_active: true,
                icon: 'fas fa-bug'
            },
            {
                id: '9',
                name_en: 'Gardener',
                name_hi: 'माली',
                category: 'gardening',
                description_en: 'Plant care, lawn mowing, garden maintenance',
                description_hi: 'पौधों की देखभाल, लॉन काटना, बगीचे का रखरखाव',
                base_price: 199,
                duration_minutes: 90,
                is_active: true,
                icon: 'fas fa-seedling'
            },
            {
                id: '10',
                name_en: 'Security Guard',
                name_hi: 'सिक्योरिटी गार्ड',
                category: 'security',
                description_en: 'Event security, home security, personal protection',
                description_hi: 'इवेंट सिक्योरिटी, घर की सुरक्षा, व्यक्तिगत सुरक्षा',
                base_price: 799,
                duration_minutes: 480,
                is_active: true,
                icon: 'fas fa-shield-alt'
            }
        ];
    }
    
    extractCategories() {\n        const categorySet = new Set();\n        this.services.forEach(service => {\n            if (service.is_active) {\n                categorySet.add(service.category);\n            }\n        });\n        \n        this.categories = Array.from(categorySet).map(cat => ({\n            id: cat,\n            name_en: this.getCategoryNameEn(cat),\n            name_hi: this.getCategoryNameHi(cat),\n            icon: this.getCategoryIcon(cat)\n        }));\n    }\n    \n    getCategoryNameEn(category) {\n        const names = {\n            carpenter: 'Carpentry',\n            electrician: 'Electrical',\n            plumber: 'Plumbing',\n            pandit: 'Religious Services',\n            cleaner: 'Cleaning',\n            painter: 'Painting',\n            appliance_repair: 'Appliance Repair',\n            pest_control: 'Pest Control',\n            gardening: 'Gardening',\n            security: 'Security'\n        };\n        return names[category] || category;\n    }\n    \n    getCategoryNameHi(category) {\n        const names = {\n            carpenter: 'बढ़ईगिरी',\n            electrician: 'बिजली का काम',\n            plumber: 'नलसाजी',\n            pandit: 'धार्मिक सेवाएं',\n            cleaner: 'सफाई',\n            painter: 'पेंटिंग',\n            appliance_repair: 'उपकरण मरम्मत',\n            pest_control: 'कीट नियंत्रण',\n            gardening: 'बागवानी',\n            security: 'सुरक्षा'\n        };\n        return names[category] || category;\n    }\n    \n    getCategoryIcon(category) {\n        const icons = {\n            carpenter: 'fas fa-hammer',\n            electrician: 'fas fa-bolt',\n            plumber: 'fas fa-wrench',\n            pandit: 'fas fa-pray',\n            cleaner: 'fas fa-broom',\n            painter: 'fas fa-paint-roller',\n            appliance_repair: 'fas fa-tools',\n            pest_control: 'fas fa-bug',\n            gardening: 'fas fa-seedling',\n            security: 'fas fa-shield-alt'\n        };\n        return icons[category] || 'fas fa-cog';\n    }\n    \n    // Public methods for getting services data\n    getAllServices() {\n        return this.services.filter(service => service.is_active);\n    }\n    \n    getServiceById(id) {\n        return this.services.find(service => service.id === id);\n    }\n    \n    getServicesByCategory(category) {\n        return this.services.filter(service => \n            service.category === category && service.is_active\n        );\n    }\n    \n    searchServices(query) {\n        const searchTerm = query.toLowerCase();\n        return this.services.filter(service => {\n            if (!service.is_active) return false;\n            \n            return (\n                service.name_en.toLowerCase().includes(searchTerm) ||\n                service.name_hi.includes(searchTerm) ||\n                service.category.toLowerCase().includes(searchTerm) ||\n                service.description_en.toLowerCase().includes(searchTerm) ||\n                service.description_hi.includes(searchTerm)\n            );\n        });\n    }\n    \n    getCategories() {\n        return this.categories;\n    }\n    \n    // Service pricing and estimation\n    calculateEstimatedPrice(serviceId, duration = null) {\n        const service = this.getServiceById(serviceId);\n        if (!service) return 0;\n        \n        let price = service.base_price;\n        \n        // If custom duration is provided, calculate based on hourly rate\n        if (duration && duration !== service.duration_minutes) {\n            const hourlyRate = (service.base_price / service.duration_minutes) * 60;\n            price = Math.round((hourlyRate * duration) / 60);\n        }\n        \n        return price;\n    }\n    \n    getServiceEstimatedTime(serviceId) {\n        const service = this.getServiceById(serviceId);\n        if (!service) return 0;\n        \n        return service.duration_minutes;\n    }\n    \n    // Format service information\n    formatServiceCard(service, language = 'english') {\n        const name = language === 'hindi' ? service.name_hi : service.name_en;\n        const description = language === 'hindi' ? service.description_hi : service.description_en;\n        \n        return {\n            id: service.id,\n            name: name,\n            description: description,\n            price: service.base_price,\n            duration: service.duration_minutes,\n            category: service.category,\n            icon: service.icon\n        };\n    }\n    \n    // Service availability checking\n    isServiceAvailable(serviceId, pinCode) {\n        // This would check against provider availability in the area\n        // For demo purposes, return true for all services\n        return true;\n    }\n    \n    // Get popular services\n    getPopularServices(limit = 6) {\n        // This would be based on booking frequency\n        // For now, return first N services\n        return this.getAllServices().slice(0, limit);\n    }\n    \n    // Get emergency services\n    getEmergencyServices() {\n        const emergencyCategories = ['electrician', 'plumber', 'security'];\n        return this.services.filter(service => \n            emergencyCategories.includes(service.category) && service.is_active\n        );\n    }\n    \n    // Service add-ons and variants\n    getServiceAddOns(serviceId) {\n        // This would return additional services or add-ons\n        // For demo purposes, return empty array\n        return [];\n    }\n    \n    // Provider matching\n    async findNearbyProviders(serviceId, lat, lng, radius = 2) {\n        try {\n            // This would make an API call to find providers\n            const response = await fetch(`tables/providers?service=${serviceId}&lat=${lat}&lng=${lng}&radius=${radius}`);\n            const result = await response.json();\n            return result.data || [];\n        } catch (error) {\n            console.error('Error finding providers:', error);\n            return [];\n        }\n    }\n    \n    // Service booking preparation\n    prepareBookingData(serviceId, customerData) {\n        const service = this.getServiceById(serviceId);\n        if (!service) return null;\n        \n        return {\n            service_id: serviceId,\n            service_name: service.name_en,\n            estimated_price: service.base_price,\n            estimated_duration: service.duration_minutes,\n            customer_phone: customerData.phone,\n            service_address: customerData.address,\n            pin_code: customerData.pinCode,\n            latitude: customerData.lat,\n            longitude: customerData.lng,\n            scheduled_datetime: new Date().toISOString(),\n            status: 'pending',\n            payment_method: 'cash', // Default\n            payment_status: 'pending'\n        };\n    }\n}\n\n// Initialize services manager\nconst servicesManager = new ServicesManager();\n\n// Export for global access\nwindow.servicesManager = servicesManager;