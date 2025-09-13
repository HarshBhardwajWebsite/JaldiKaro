// Provider signup management for Jaldikaro
class ProviderSignup {
    constructor() {
        this.currentStep = 1;
        this.selectedServices = [];
        this.formData = {
            // Step 1: Personal Information
            fullName: '',
            phoneNumber: '',
            email: '',
            experience: '',
            languagesSpoken: [],
            bio: '',
            
            // Step 2: Services & Pricing
            services: [],
            pricing: {},
            
            // Step 3: Service Areas
            primaryLocation: '',
            serviceRadius: 2,
            additionalAreas: [],
            workingHours: { start: 8, end: 18 },
            workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
            
            // Step 4: Documents
            profilePhoto: null,
            idType: '',
            idNumber: '',
            idDocument: null,
            portfolio: []
        };
        
        this.init();
    }
    
    init() {
        this.bindStepNavigation();
        this.bindFormValidation();
        this.loadServices();
        this.bindFileUploads();
    }
    
    bindStepNavigation() {
        // Step 1 navigation
        document.getElementById('step1Next')?.addEventListener('click', () => {
            if (this.validateStep1()) {
                this.nextStep();
            }
        });
        
        // Step 2 navigation
        document.getElementById('step2Next')?.addEventListener('click', () => {
            if (this.validateStep2()) {
                this.nextStep();
            }
        });
        
        document.getElementById('step2Back')?.addEventListener('click', () => {
            this.previousStep();
        });
        
        // Step 3 navigation
        document.getElementById('step3Next')?.addEventListener('click', () => {
            if (this.validateStep3()) {
                this.nextStep();
            }
        });
        
        document.getElementById('step3Back')?.addEventListener('click', () => {
            this.previousStep();
        });
        
        // Step 4 navigation
        document.getElementById('step4Back')?.addEventListener('click', () => {
            this.previousStep();
        });
        
        document.getElementById('submitApplication')?.addEventListener('click', () => {
            this.submitApplication();
        });
    }
    
    bindFormValidation() {
        // Step 1 form validation
        const step1Fields = ['fullName', 'phoneNumber', 'email', 'experience'];
        step1Fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            field?.addEventListener('input', () => {
                this.validateStep1();
            });
        });
        
        // Languages checkboxes
        document.querySelectorAll('input[type="checkbox"][value]').forEach(checkbox => {
            if (checkbox.closest('#step1')) {
                checkbox.addEventListener('change', () => {
                    this.updateLanguages();
                    this.validateStep1();
                });
            }
        });
        
        // Step 3 validation
        const step3Fields = ['primaryLocation'];
        step3Fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            field?.addEventListener('input', () => {
                this.validateStep3();
            });
        });
        
        // Step 4 validation
        const step4Checkboxes = ['agreeTerms', 'agreeBackground'];
        step4Checkboxes.forEach(checkboxId => {
            const checkbox = document.getElementById(checkboxId);
            checkbox?.addEventListener('change', () => {
                this.validateStep4();
            });
        });
    }
    
    async loadServices() {
        try {
            const services = await servicesManager.getAllServices();
            this.renderServicesGrid(services);
        } catch (error) {
            console.error('Error loading services:', error);
        }
    }
    
    renderServicesGrid(services) {
        const container = document.getElementById('servicesGrid');
        if (!container) return;
        
        container.innerHTML = services.map(service => `
            <div class="service-checkbox border-2 border-gray-200 rounded-xl p-4 cursor-pointer hover:border-orange-300 transition-all" 
                 data-service-id="${service.id}"
                 onclick="providerSignup.toggleService('${service.id}')">
                <div class="text-center">
                    <div class="text-2xl mb-2 text-gray-600">
                        <i class="${service.icon}"></i>
                    </div>
                    <h4 class="font-medium text-gray-800 text-sm">${service.name_en}</h4>
                    <p class="text-xs text-gray-500 mt-1">₹${service.base_price}+ avg</p>
                </div>
            </div>
        `).join('');
    }
    
    toggleService(serviceId) {\n        const serviceElement = document.querySelector(`[data-service-id=\"${serviceId}\"]`);\n        const isSelected = this.selectedServices.includes(serviceId);\n        \n        if (isSelected) {\n            // Remove service\n            this.selectedServices = this.selectedServices.filter(id => id !== serviceId);\n            serviceElement.classList.remove('selected');\n        } else {\n            // Add service\n            this.selectedServices.push(serviceId);\n            serviceElement.classList.add('selected');\n        }\n        \n        this.updatePricingSection();\n        this.validateStep2();\n        \n        app.trackEvent('provider_service_toggled', {\n            service_id: serviceId,\n            selected: !isSelected,\n            total_services: this.selectedServices.length\n        });\n    }\n    \n    updatePricingSection() {\n        const container = document.getElementById('pricingSection');\n        if (!container) return;\n        \n        if (this.selectedServices.length === 0) {\n            container.innerHTML = '<p class=\"text-gray-500 text-center py-8\">Select services to set pricing</p>';\n            return;\n        }\n        \n        const servicesData = servicesManager.getAllServices();\n        const selectedServicesData = servicesData.filter(service => \n            this.selectedServices.includes(service.id)\n        );\n        \n        container.innerHTML = selectedServicesData.map(service => `\n            <div class=\"border border-gray-200 rounded-xl p-4\">\n                <div class=\"flex items-center justify-between mb-3\">\n                    <div class=\"flex items-center space-x-3\">\n                        <i class=\"${service.icon} text-orange-500\"></i>\n                        <span class=\"font-medium text-gray-800\">${service.name_en}</span>\n                    </div>\n                    <span class=\"text-sm text-gray-500\">Market avg: ₹${service.base_price}/hr</span>\n                </div>\n                \n                <div class=\"grid grid-cols-2 gap-4\">\n                    <div>\n                        <label class=\"block text-sm text-gray-600 mb-1\">Your Rate (₹/hour)</label>\n                        <input type=\"number\" \n                               id=\"pricing_${service.id}\" \n                               class=\"w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500\" \n                               placeholder=\"${service.base_price}\"\n                               min=\"50\"\n                               value=\"${service.base_price}\"\n                               onchange=\"providerSignup.updatePricing('${service.id}', this.value)\">\n                    </div>\n                    <div>\n                        <label class=\"block text-sm text-gray-600 mb-1\">Minimum Charge</label>\n                        <input type=\"number\" \n                               id=\"min_charge_${service.id}\" \n                               class=\"w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500\" \n                               placeholder=\"${Math.round(service.base_price * 0.8)}\"\n                               min=\"50\"\n                               value=\"${Math.round(service.base_price * 0.8)}\"\n                               onchange=\"providerSignup.updateMinCharge('${service.id}', this.value)\">\n                    </div>\n                </div>\n            </div>\n        `).join('');\n        \n        // Initialize pricing data\n        selectedServicesData.forEach(service => {\n            this.formData.pricing[service.id] = {\n                hourlyRate: service.base_price,\n                minimumCharge: Math.round(service.base_price * 0.8)\n            };\n        });\n    }\n    \n    updatePricing(serviceId, rate) {\n        if (!this.formData.pricing[serviceId]) {\n            this.formData.pricing[serviceId] = {};\n        }\n        this.formData.pricing[serviceId].hourlyRate = parseInt(rate);\n        this.validateStep2();\n    }\n    \n    updateMinCharge(serviceId, charge) {\n        if (!this.formData.pricing[serviceId]) {\n            this.formData.pricing[serviceId] = {};\n        }\n        this.formData.pricing[serviceId].minimumCharge = parseInt(charge);\n    }\n    \n    bindFileUploads() {\n        // Profile photo upload\n        document.getElementById('profilePhoto')?.addEventListener('change', (e) => {\n            this.handleFileUpload(e, 'profilePhoto', true);\n        });\n        \n        // ID document upload\n        document.getElementById('idProof')?.addEventListener('change', (e) => {\n            this.handleFileUpload(e, 'idDocument', false);\n        });\n        \n        // Portfolio upload\n        document.getElementById('portfolio')?.addEventListener('change', (e) => {\n            this.handlePortfolioUpload(e);\n        });\n    }\n    \n    handleFileUpload(event, fieldName, isImage = false) {\n        const file = event.target.files[0];\n        if (!file) return;\n        \n        // Validate file size (max 5MB)\n        if (file.size > 5 * 1024 * 1024) {\n            alert('File size should be less than 5MB');\n            return;\n        }\n        \n        this.formData[fieldName] = file;\n        \n        // Show preview for images\n        if (isImage && fieldName === 'profilePhoto') {\n            const reader = new FileReader();\n            reader.onload = (e) => {\n                const preview = document.getElementById('photoPreview');\n                const image = document.getElementById('photoImage');\n                image.src = e.target.result;\n                preview.classList.remove('hidden');\n            };\n            reader.readAsDataURL(file);\n        }\n        \n        this.validateStep4();\n    }\n    \n    handlePortfolioUpload(event) {\n        const files = Array.from(event.target.files);\n        \n        // Limit to 5 files\n        if (files.length > 5) {\n            alert('You can upload maximum 5 portfolio images');\n            return;\n        }\n        \n        // Validate each file\n        const validFiles = files.filter(file => {\n            if (file.size > 3 * 1024 * 1024) {\n                alert(`${file.name} is too large. Please keep images under 3MB.`);\n                return false;\n            }\n            return true;\n        });\n        \n        this.formData.portfolio = validFiles;\n    }\n    \n    updateLanguages() {\n        const checkboxes = document.querySelectorAll('#step1 input[type=\"checkbox\"]:checked');\n        this.formData.languagesSpoken = Array.from(checkboxes).map(cb => cb.value);\n    }\n    \n    validateStep1() {\n        const requiredFields = {\n            fullName: document.getElementById('fullName')?.value?.trim(),\n            phoneNumber: document.getElementById('phoneNumber')?.value?.trim(),\n            email: document.getElementById('email')?.value?.trim(),\n            experience: document.getElementById('experience')?.value\n        };\n        \n        // Update form data\n        Object.keys(requiredFields).forEach(key => {\n            this.formData[key] = requiredFields[key];\n        });\n        \n        this.formData.bio = document.getElementById('bio')?.value?.trim() || '';\n        \n        // Validate required fields\n        const isValid = Object.values(requiredFields).every(value => value && value.length > 0) &&\n                       this.formData.languagesSpoken.length > 0 &&\n                       this.validateEmail(requiredFields.email) &&\n                       this.validatePhone(requiredFields.phoneNumber);\n        \n        const nextBtn = document.getElementById('step1Next');\n        nextBtn.disabled = !isValid;\n        \n        return isValid;\n    }\n    \n    validateStep2() {\n        const hasServices = this.selectedServices.length > 0;\n        const hasPricing = this.selectedServices.every(serviceId => {\n            const pricing = this.formData.pricing[serviceId];\n            return pricing && pricing.hourlyRate > 0;\n        });\n        \n        const isValid = hasServices && hasPricing;\n        \n        // Update form data\n        this.formData.services = this.selectedServices;\n        \n        const nextBtn = document.getElementById('step2Next');\n        nextBtn.disabled = !isValid;\n        \n        return isValid;\n    }\n    \n    validateStep3() {\n        const primaryLocation = document.getElementById('primaryLocation')?.value?.trim();\n        \n        // Update form data\n        this.formData.primaryLocation = primaryLocation;\n        this.formData.serviceRadius = parseInt(document.getElementById('serviceRadius')?.value) || 2;\n        this.formData.additionalAreas = document.getElementById('additionalAreas')?.value\n            ?.split(',')\n            ?.map(area => area.trim())\n            ?.filter(area => area.length > 0) || [];\n        \n        // Update working hours\n        this.formData.workingHours = {\n            start: parseInt(document.getElementById('startTime')?.value) || 8,\n            end: parseInt(document.getElementById('endTime')?.value) || 18\n        };\n        \n        // Update working days\n        const dayCheckboxes = document.querySelectorAll('#step3 input[type=\"checkbox\"]:checked');\n        this.formData.workingDays = Array.from(dayCheckboxes).map(cb => cb.value);\n        \n        const isValid = primaryLocation && primaryLocation.length > 0;\n        \n        const nextBtn = document.getElementById('step3Next');\n        nextBtn.disabled = !isValid;\n        \n        return isValid;\n    }\n    \n    validateStep4() {\n        const hasProfilePhoto = this.formData.profilePhoto !== null;\n        const hasIdType = document.getElementById('idType')?.value;\n        const hasIdNumber = document.getElementById('idNumber')?.value?.trim();\n        const hasIdDocument = this.formData.idDocument !== null;\n        const agreedTerms = document.getElementById('agreeTerms')?.checked;\n        const agreedBackground = document.getElementById('agreeBackground')?.checked;\n        \n        // Update form data\n        this.formData.idType = hasIdType;\n        this.formData.idNumber = hasIdNumber;\n        \n        const isValid = hasProfilePhoto && hasIdType && hasIdNumber && hasIdDocument && \n                       agreedTerms && agreedBackground;\n        \n        const submitBtn = document.getElementById('submitApplication');\n        submitBtn.disabled = !isValid;\n        \n        return isValid;\n    }\n    \n    validateEmail(email) {\n        return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);\n    }\n    \n    validatePhone(phone) {\n        // Remove all non-digit characters\n        const cleanPhone = phone.replace(/\\D/g, '');\n        return /^[6-9]\\d{9}$/.test(cleanPhone);\n    }\n    \n    nextStep() {\n        if (this.currentStep < 4) {\n            this.currentStep++;\n            this.showStep(this.currentStep);\n            \n            app.trackEvent('provider_signup_step_completed', {\n                step: this.currentStep - 1,\n                total_services: this.selectedServices.length\n            });\n        }\n    }\n    \n    previousStep() {\n        if (this.currentStep > 1) {\n            this.currentStep--;\n            this.showStep(this.currentStep);\n        }\n    }\n    \n    showStep(stepNumber) {\n        // Hide all steps\n        document.querySelectorAll('.signup-step').forEach(step => {\n            step.classList.remove('active');\n        });\n        \n        // Show current step\n        document.getElementById(`step${stepNumber}`)?.classList.add('active');\n        \n        // Update step indicators\n        this.updateStepIndicators();\n        \n        // Scroll to top\n        window.scrollTo({ top: 0, behavior: 'smooth' });\n    }\n    \n    updateStepIndicators() {\n        for (let i = 1; i <= 4; i++) {\n            const indicator = document.getElementById(`step${i}Indicator`);\n            if (indicator) {\n                indicator.className = 'step-indicator w-10 h-10 rounded-full flex items-center justify-center font-bold';\n                \n                if (i < this.currentStep) {\n                    indicator.classList.add('step-completed');\n                } else if (i === this.currentStep) {\n                    indicator.classList.add('step-active');\n                } else {\n                    indicator.classList.add('step-pending');\n                }\n            }\n        }\n    }\n    \n    async submitApplication() {\n        if (!this.validateStep4()) {\n            alert('Please complete all required fields.');\n            return;\n        }\n        \n        const submitBtn = document.getElementById('submitApplication');\n        const originalText = submitBtn.innerHTML;\n        \n        // Show loading state\n        submitBtn.innerHTML = `\n            <i class=\"fas fa-spinner fa-spin mr-2\"></i>\n            Submitting...\n        `;\n        submitBtn.disabled = true;\n        \n        try {\n            // Prepare application data\n            const applicationData = {\n                name: this.formData.fullName,\n                phone_number: this.formData.phoneNumber,\n                email: this.formData.email,\n                experience_years: this.parseExperience(this.formData.experience),\n                languages_spoken: this.formData.languagesSpoken,\n                services: this.formData.services,\n                hourly_rate: this.calculateAverageRate(),\n                service_areas: [this.formData.primaryLocation, ...this.formData.additionalAreas],\n                is_verified: false,\n                is_online: false,\n                bio: this.formData.bio,\n                available_slots: this.generateAvailableSlots(),\n                kyc_documents: [\n                    {\n                        type: this.formData.idType,\n                        number: this.formData.idNumber,\n                        status: 'pending'\n                    }\n                ],\n                registration_status: 'pending',\n                created_at: new Date().toISOString()\n            };\n            \n            // Submit to API\n            const response = await fetch('tables/providers', {\n                method: 'POST',\n                headers: {\n                    'Content-Type': 'application/json'\n                },\n                body: JSON.stringify(applicationData)\n            });\n            \n            const result = await response.json();\n            \n            if (response.ok) {\n                // Upload files (simulated for demo)\n                await this.uploadFiles(result.id);\n                \n                // Show success modal\n                this.showSuccessModal(result.id);\n                \n                app.trackEvent('provider_application_submitted', {\n                    provider_id: result.id,\n                    services_count: this.formData.services.length,\n                    experience: this.formData.experience\n                });\n            } else {\n                throw new Error(result.message || 'Application submission failed');\n            }\n        } catch (error) {\n            console.error('Application submission error:', error);\n            alert('Application submission failed. Please try again.');\n            \n            // Reset button\n            submitBtn.innerHTML = originalText;\n            submitBtn.disabled = false;\n            \n            app.trackEvent('provider_application_failed', {\n                error: error.message\n            });\n        }\n    }\n    \n    parseExperience(experienceRange) {\n        const mapping = {\n            '0-1': 0.5,\n            '1-3': 2,\n            '3-5': 4,\n            '5-10': 7.5,\n            '10+': 12\n        };\n        return mapping[experienceRange] || 0;\n    }\n    \n    calculateAverageRate() {\n        const rates = Object.values(this.formData.pricing).map(p => p.hourlyRate);\n        return rates.length > 0 ? Math.round(rates.reduce((a, b) => a + b, 0) / rates.length) : 0;\n    }\n    \n    generateAvailableSlots() {\n        // Generate default available slots based on working hours and days\n        const slots = [];\n        const { start, end } = this.formData.workingHours;\n        \n        for (let hour = start; hour < end; hour++) {\n            slots.push(`${hour}:00`);\n        }\n        \n        return {\n            days: this.formData.workingDays,\n            hours: slots\n        };\n    }\n    \n    async uploadFiles(providerId) {\n        // In a real application, this would upload files to cloud storage\n        // For demo purposes, we'll just simulate the process\n        \n        const filesToUpload = [\n            { file: this.formData.profilePhoto, type: 'profile' },\n            { file: this.formData.idDocument, type: 'id' },\n            ...this.formData.portfolio.map(file => ({ file, type: 'portfolio' }))\n        ].filter(item => item.file);\n        \n        console.log(`Uploading ${filesToUpload.length} files for provider ${providerId}`);\n        \n        // Simulate upload delay\n        await new Promise(resolve => setTimeout(resolve, 1000));\n        \n        return true;\n    }\n    \n    showSuccessModal(providerId) {\n        document.getElementById('successModal').classList.remove('hidden');\n        document.body.style.overflow = 'hidden';\n        \n        // Send welcome email/SMS (simulated)\n        this.sendWelcomeNotification(providerId);\n    }\n    \n    sendWelcomeNotification(providerId) {\n        try {\n            // This would integrate with email/SMS service\n            const message = `Welcome to Jaldikaro! Your application has been received (ID: ${providerId}). We'll review and contact you within 24-48 hours.`;\n            \n            console.log('Welcome notification sent:', message);\n            \n            // Browser notification\n            if ('Notification' in window && Notification.permission === 'granted') {\n                new Notification('Jaldikaro - Application Submitted!', {\n                    body: 'Thank you for applying! We\\'ll review your application soon.',\n                    icon: '/favicon.ico'\n                });\n            }\n        } catch (error) {\n            console.error('Error sending welcome notification:', error);\n        }\n    }\n}\n\n// Initialize provider signup\nconst providerSignup = new ProviderSignup();\n\n// Export for global access\nwindow.providerSignup = providerSignup;\n\n// Request notification permission\nif ('Notification' in window && Notification.permission === 'default') {\n    Notification.requestPermission();\n}