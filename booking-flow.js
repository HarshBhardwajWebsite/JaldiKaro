// Booking flow management for Jaldikaro
class BookingFlow {
    constructor() {
        this.currentStep = 1;
        this.bookingData = {
            phone: '',
            location: {
                pinCode: '',
                address: '',
                lat: null,
                lng: null,
                detectedLocation: false
            },
            service: null
        };
        
        this.init();
    }
    
    init() {
        this.bindStepEvents();
        this.initializeStepValidation();
    }
    
    bindStepEvents() {
        // Step 1: Phone validation and navigation
        const phoneInput = document.getElementById('phoneInput');
        const phoneNextBtn = document.getElementById('phoneNextBtn');
        
        phoneInput?.addEventListener('input', (e) => {
            const phone = this.formatPhoneInput(e.target.value);
            e.target.value = phone;
            
            const isValid = this.validatePhone(phone);
            phoneNextBtn.disabled = !isValid;
            
            if (isValid) {
                phoneNextBtn.classList.remove('bg-gray-300', 'cursor-not-allowed');
                phoneNextBtn.classList.add('bg-orange-500', 'hover:bg-orange-600');
            } else {
                phoneNextBtn.classList.add('bg-gray-300', 'cursor-not-allowed');
                phoneNextBtn.classList.remove('bg-orange-500', 'hover:bg-orange-600');
            }
        });
        
        phoneInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !phoneNextBtn.disabled) {
                this.nextStep();
            }
        });
        
        phoneNextBtn?.addEventListener('click', () => {
            this.nextStep();
        });
        
        // Step 2: Location handling
        document.getElementById('detectLocationBtn')?.addEventListener('click', () => {
            this.detectLocation();
        });
        
        const pinCodeInput = document.getElementById('pinCodeInput');
        const addressInput = document.getElementById('addressInput');
        const locationNextBtn = document.getElementById('locationNextBtn');
        
        [pinCodeInput, addressInput].forEach(input => {
            input?.addEventListener('input', () => {
                this.validateLocationStep();
            });
        });
        
        pinCodeInput?.addEventListener('keypress', (e) => {
            // Only allow numbers
            if (!/\d/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter'].includes(e.key)) {
                e.preventDefault();
            }
            
            if (e.key === 'Enter') {
                addressInput?.focus();
            }
        });
        
        locationNextBtn?.addEventListener('click', () => {
            this.nextStep();
        });
        
        document.getElementById('locationBackBtn')?.addEventListener('click', () => {
            this.previousStep();
        });
        
        // Step 3: Service selection
        document.getElementById('findProvidersBtn')?.addEventListener('click', () => {
            this.findProviders();
        });
        
        document.getElementById('serviceBackBtn')?.addEventListener('click', () => {
            this.previousStep();
        });
        
        // Service search
        const serviceSearch = document.getElementById('serviceSearch');
        serviceSearch?.addEventListener('input', (e) => {
            this.filterServices(e.target.value);
        });
    }
    
    formatPhoneInput(value) {
        // Remove all non-numeric characters and limit to 10 digits
        return value.replace(/\D/g, '').slice(0, 10);
    }
    
    validatePhone(phone) {
        // Indian mobile number validation (starts with 6-9, 10 digits total)
        return /^[6-9]\d{9}$/.test(phone);
    }
    
    validateLocationStep() {
        const pinCode = document.getElementById('pinCodeInput')?.value || '';
        const address = document.getElementById('addressInput')?.value || '';
        const locationNextBtn = document.getElementById('locationNextBtn');
        
        const isValidPin = /^\d{6}$/.test(pinCode);
        const hasAddress = address.trim().length > 10;
        const hasDetectedLocation = this.bookingData.location.detectedLocation;
        
        const isValid = hasDetectedLocation || (isValidPin && hasAddress);
        
        locationNextBtn.disabled = !isValid;
        
        if (isValid) {
            locationNextBtn.classList.remove('bg-gray-300', 'cursor-not-allowed');
            locationNextBtn.classList.add('bg-orange-500', 'hover:bg-orange-600');
        } else {
            locationNextBtn.classList.add('bg-gray-300', 'cursor-not-allowed');
            locationNextBtn.classList.remove('bg-orange-500', 'hover:bg-orange-600');
        }
    }
    
    async detectLocation() {
        const detectBtn = document.getElementById('detectLocationBtn');
        const locationInfo = document.getElementById('locationInfo');
        const locationText = document.getElementById('locationText');
        const nearbyText = document.getElementById('nearbyText');
        
        // Show loading state\n        detectBtn.innerHTML = `\n            <i class=\"fas fa-spinner fa-spin mr-3\"></i>\n            <span>Detecting...</span>\n        `;\n        detectBtn.disabled = true;\n        \n        try {\n            const position = await new Promise((resolve, reject) => {\n                navigator.geolocation.getCurrentPosition(resolve, reject, {\n                    enableHighAccuracy: true,\n                    timeout: 10000,\n                    maximumAge: 60000\n                });\n            });\n            \n            const { latitude, longitude } = position.coords;\n            \n            // Save coordinates\n            this.bookingData.location.lat = latitude;\n            this.bookingData.location.lng = longitude;\n            this.bookingData.location.detectedLocation = true;\n            \n            // Show location detected\n            locationInfo.classList.remove('hidden');\n            locationText.textContent = `Location detected (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;\n            nearbyText.textContent = 'Location saved successfully!';\n            \n            // Try to get address from coordinates\n            this.reverseGeocode(latitude, longitude);\n            \n            // Enable next step\n            this.validateLocationStep();\n            \n            app.trackEvent('location_detected', {\n                method: 'gps',\n                accuracy: position.coords.accuracy\n            });\n            \n        } catch (error) {\n            console.error('Geolocation error:', error);\n            \n            let errorMessage = 'Unable to detect location. ';\n            switch (error.code) {\n                case error.PERMISSION_DENIED:\n                    errorMessage += 'Please allow location access.';\n                    break;\n                case error.POSITION_UNAVAILABLE:\n                    errorMessage += 'Location information is unavailable.';\n                    break;\n                case error.TIMEOUT:\n                    errorMessage += 'Location request timed out.';\n                    break;\n                default:\n                    errorMessage += 'Please enter manually.';\n                    break;\n            }\n            \n            locationInfo.classList.remove('hidden');\n            locationInfo.className = 'bg-red-50 border border-red-200 rounded-xl p-4';\n            locationText.className = 'text-red-700';\n            locationText.innerHTML = `<i class=\"fas fa-exclamation-triangle mr-2\"></i>${errorMessage}`;\n            nearbyText.className = 'text-sm text-red-600 mt-1';\n            nearbyText.textContent = 'Please enter your pin code and address manually.';\n            \n            app.trackEvent('location_error', {\n                error_code: error.code,\n                error_message: error.message\n            });\n        } finally {\n            // Reset button\n            detectBtn.innerHTML = `\n                <i class=\"fas fa-location-arrow mr-3\"></i>\n                <span>Use current location</span>\n            `;\n            detectBtn.disabled = false;\n        }\n    }\n    \n    async reverseGeocode(lat, lng) {\n        try {\n            // This would normally use a geocoding service\n            // For demo purposes, we'll simulate it\n            const simulatedAddress = {\n                pinCode: '110001',\n                address: `Near ${lat.toFixed(4)}, ${lng.toFixed(4)}, New Delhi`\n            };\n            \n            document.getElementById('pinCodeInput').value = simulatedAddress.pinCode;\n            document.getElementById('addressInput').value = simulatedAddress.address;\n            \n            this.bookingData.location.pinCode = simulatedAddress.pinCode;\n            this.bookingData.location.address = simulatedAddress.address;\n            \n        } catch (error) {\n            console.error('Reverse geocoding error:', error);\n        }\n    }\n    \n    initializeStepValidation() {\n        // Initialize step indicators\n        this.updateStepIndicators();\n    }\n    \n    nextStep() {\n        if (this.currentStep === 1) {\n            // Save phone number\n            const phone = document.getElementById('phoneInput')?.value;\n            if (this.validatePhone(phone)) {\n                this.bookingData.phone = phone;\n                this.currentStep = 2;\n                this.showStep(2);\n                app.trackEvent('booking_step_completed', { step: 1 });\n            }\n        } else if (this.currentStep === 2) {\n            // Save location\n            const pinCode = document.getElementById('pinCodeInput')?.value;\n            const address = document.getElementById('addressInput')?.value;\n            \n            if (this.bookingData.location.detectedLocation || (pinCode && address)) {\n                if (!this.bookingData.location.detectedLocation) {\n                    this.bookingData.location.pinCode = pinCode;\n                    this.bookingData.location.address = address;\n                }\n                \n                this.currentStep = 3;\n                this.showStep(3);\n                this.loadServicesForSelection();\n                app.trackEvent('booking_step_completed', { step: 2 });\n            }\n        }\n    }\n    \n    previousStep() {\n        if (this.currentStep > 1) {\n            this.currentStep--;\n            this.showStep(this.currentStep);\n        }\n    }\n    \n    showStep(stepNumber) {\n        // Hide all steps\n        document.querySelectorAll('.booking-step').forEach(step => {\n            step.classList.remove('active');\n        });\n        \n        // Show current step\n        const currentStepEl = document.getElementById(`step${stepNumber}`);\n        currentStepEl?.classList.add('active');\n        \n        // Update indicators\n        this.updateStepIndicators();\n        \n        // Focus appropriate input\n        setTimeout(() => {\n            if (stepNumber === 1) {\n                document.getElementById('phoneInput')?.focus();\n            } else if (stepNumber === 2) {\n                document.getElementById('pinCodeInput')?.focus();\n            } else if (stepNumber === 3) {\n                document.getElementById('serviceSearch')?.focus();\n            }\n        }, 100);\n    }\n    \n    updateStepIndicators() {\n        for (let i = 1; i <= 3; i++) {\n            const indicator = document.getElementById(`step${i}Indicator`);\n            if (indicator) {\n                indicator.className = 'step-indicator w-10 h-10 rounded-full flex items-center justify-center font-bold';\n                \n                if (i < this.currentStep) {\n                    indicator.classList.add('step-completed');\n                } else if (i === this.currentStep) {\n                    indicator.classList.add('step-active');\n                } else {\n                    indicator.classList.add('step-pending');\n                }\n            }\n        }\n    }\n    \n    async loadServicesForSelection() {\n        try {\n            const services = await app.getServices();\n            this.renderServiceGrid(services);\n        } catch (error) {\n            console.error('Error loading services:', error);\n            this.renderServiceGrid(app.getDefaultServices());\n        }\n    }\n    \n    renderServiceGrid(services) {\n        const container = document.getElementById('serviceGrid');\n        if (!container) return;\n        \n        container.innerHTML = services.map(service => `\n            <div class=\"service-card bg-white border-2 border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-orange-300 transition-all\" \n                 onclick=\"bookingFlow.selectService('${service.id}')\" \n                 data-service-id=\"${service.id}\"\n                 data-search-terms=\"${service.name_en.toLowerCase()} ${service.name_hi} ${service.category}\">\n                <div class=\"text-3xl mb-3 text-gray-600\">\n                    <i class=\"${service.icon}\"></i>\n                </div>\n                <h3 class=\"font-bold text-gray-800 mb-1 text-sm\">${service.name_en}</h3>\n                <p class=\"text-xs text-gray-600\">${service.name_hi}</p>\n                <p class=\"text-orange-500 font-bold text-sm mt-2\">₹${service.base_price}+</p>\n            </div>\n        `).join('');\n    }\n    \n    selectService(serviceId) {\n        // Remove previous selection\n        document.querySelectorAll('.service-card').forEach(card => {\n            card.classList.remove('border-orange-500', 'bg-orange-50');\n            card.classList.add('border-gray-200');\n        });\n        \n        // Highlight selected service\n        const selectedCard = document.querySelector(`[data-service-id=\"${serviceId}\"]`);\n        if (selectedCard) {\n            selectedCard.classList.add('border-orange-500', 'bg-orange-50');\n            selectedCard.classList.remove('border-gray-200');\n        }\n        \n        // Save selection\n        this.bookingData.service = serviceId;\n        \n        // Show selected service info\n        this.showSelectedServiceInfo(serviceId);\n        \n        // Enable find providers button\n        const findBtn = document.getElementById('findProvidersBtn');\n        findBtn.disabled = false;\n        findBtn.classList.remove('bg-gray-300', 'cursor-not-allowed');\n        findBtn.classList.add('bg-orange-500', 'hover:bg-orange-600');\n        \n        app.trackEvent('service_selected', { service_id: serviceId });\n    }\n    \n    async showSelectedServiceInfo(serviceId) {\n        const services = await app.getServices();\n        const service = services.find(s => s.id === serviceId);\n        \n        if (service) {\n            const infoContainer = document.getElementById('selectedServiceInfo');\n            const iconEl = document.getElementById('selectedServiceIcon');\n            const nameEl = document.getElementById('selectedServiceName');\n            const priceEl = document.getElementById('selectedServicePrice');\n            \n            iconEl.className = service.icon;\n            nameEl.textContent = service.name_en;\n            priceEl.textContent = `Starting ₹${service.base_price}`;\n            \n            infoContainer.classList.remove('hidden');\n        }\n    }\n    \n    filterServices(searchTerm) {\n        const cards = document.querySelectorAll('.service-card[data-search-terms]');\n        const term = searchTerm.toLowerCase();\n        \n        cards.forEach(card => {\n            const searchTerms = card.getAttribute('data-search-terms');\n            if (!term || searchTerms.includes(term)) {\n                card.style.display = 'block';\n            } else {\n                card.style.display = 'none';\n            }\n        });\n    }\n    \n    async findProviders() {\n        if (!this.bookingData.service) {\n            alert('Please select a service first.');\n            return;\n        }\n        \n        // Validate all booking data\n        if (!this.validateBookingData()) {\n            alert('Please complete all steps before finding providers.');\n            return;\n        }\n        \n        // Show loading state\n        const findBtn = document.getElementById('findProvidersBtn');\n        const originalText = findBtn.innerHTML;\n        findBtn.innerHTML = `\n            <i class=\"fas fa-spinner fa-spin mr-3\"></i>\n            Finding providers...\n        `;\n        findBtn.disabled = true;\n        \n        try {\n            app.trackEvent('find_providers_clicked', this.bookingData);\n            \n            // Simulate API call to find providers\n            await new Promise(resolve => setTimeout(resolve, 1500));\n            \n            // Redirect to provider results page\n            const queryParams = new URLSearchParams({\n                phone: this.bookingData.phone,\n                pinCode: this.bookingData.location.pinCode,\n                service: this.bookingData.service,\n                address: this.bookingData.location.address\n            }).toString();\n            \n            window.location.href = `providers.html?${queryParams}`;\n            \n        } catch (error) {\n            console.error('Error finding providers:', error);\n            alert('Error finding providers. Please try again.');\n            \n            // Reset button\n            findBtn.innerHTML = originalText;\n            findBtn.disabled = false;\n        }\n    }\n    \n    validateBookingData() {\n        return (\n            this.validatePhone(this.bookingData.phone) &&\n            (this.bookingData.location.detectedLocation || \n             (this.bookingData.location.pinCode && this.bookingData.location.address)) &&\n            this.bookingData.service\n        );\n    }\n}\n\n// Initialize booking flow\nconst bookingFlow = new BookingFlow();\n\n// Export for global access\nwindow.bookingFlow = bookingFlow;