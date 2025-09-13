// Booking confirmation and management for Jaldikaro
class BookingManager {
    constructor() {
        this.searchParams = new URLSearchParams(window.location.search);
        this.bookingData = {
            phone: '',
            pinCode: '',
            service: '',
            address: '',
            providerId: '',
            selectedDate: null,
            selectedTime: null,
            instructions: '',
            paymentMethod: 'cash',
            estimatedPrice: 0
        };
        
        this.provider = null;
        this.service = null;
        
        this.init();
    }
    
    init() {
        this.extractBookingParams();
        this.loadBookingData();
        this.generateDateOptions();
        this.generateTimeSlots();
        this.bindEvents();
        this.updateUI();
    }
    
    extractBookingParams() {
        this.bookingData.phone = this.searchParams.get('phone') || '';
        this.bookingData.pinCode = this.searchParams.get('pinCode') || '';
        this.bookingData.service = this.searchParams.get('service') || '';
        this.bookingData.address = this.searchParams.get('address') || '';
        this.bookingData.providerId = this.searchParams.get('providerId') || '';
    }
    
    async loadBookingData() {
        try {
            // Load service data
            this.service = await servicesManager.getServiceById(this.bookingData.service);
            
            // Load provider data
            this.provider = await this.getProviderById(this.bookingData.providerId);
            
            if (this.service && this.provider) {
                this.bookingData.estimatedPrice = this.provider.hourly_rate;
                this.renderServiceProviderInfo();
                this.updateSummary();
                this.updateContactDetails();
            }
        } catch (error) {
            console.error('Error loading booking data:', error);
        }
    }
    
    async getProviderById(providerId) {
        try {
            const response = await fetch(`tables/providers/${providerId}`);
            const provider = await response.json();
            return provider;
        } catch (error) {
            // Fallback to demo data
            const demoProviders = [
                {
                    id: 'p1',
                    name: 'Rajesh Kumar',
                    profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
                    services: ['1'],
                    rating: 4.8,
                    total_reviews: 127,
                    hourly_rate: 350,
                    is_verified: true,
                    experience_years: 8
                }
            ];
            
            return demoProviders.find(p => p.id === providerId) || demoProviders[0];
        }
    }
    
    renderServiceProviderInfo() {
        const container = document.getElementById('serviceProviderInfo');
        if (!container || !this.service || !this.provider) return;
        
        container.innerHTML = `
            <div class="flex items-center space-x-4">
                <div class="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center">
                    <i class="${this.service.icon || 'fas fa-hammer'} text-2xl text-orange-500"></i>
                </div>
                
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-800">${this.service.name_en}</h3>
                    <p class="text-gray-600 text-sm">${this.service.description_en}</p>
                </div>
            </div>
            
            <hr class="my-4 border-gray-200">
            
            <div class="flex items-center space-x-4">
                <img src="${this.provider.profile_image}" alt="${this.provider.name}" 
                     class="w-12 h-12 rounded-full object-cover">
                
                <div class="flex-1">
                    <div class="flex items-center space-x-2">
                        <h4 class="font-semibold text-gray-800">${this.provider.name}</h4>
                        ${this.provider.is_verified ? '<i class="fas fa-check-circle text-blue-500 text-sm"></i>' : ''}
                    </div>
                    <div class="flex items-center space-x-1 text-sm text-gray-600">
                        ${this.renderStars(this.provider.rating)}
                        <span>${this.provider.rating} (${this.provider.total_reviews} reviews)</span>
                    </div>
                </div>
                
                <div class="text-right">
                    <div class="text-lg font-bold text-gray-800">₹${this.provider.hourly_rate}</div>
                    <div class="text-sm text-gray-500">/hour</div>
                </div>
            </div>
        `;
    }
    
    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star text-yellow-400"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt text-yellow-400"></i>';
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star text-yellow-400"></i>';
        }
        
        return stars;
    }
    
    generateDateOptions() {
        const container = document.getElementById('dateOptions');
        if (!container) return;
        
        const today = new Date();
        const dates = [];
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date);
        }
        
        container.innerHTML = dates.map((date, index) => {
            const isToday = index === 0;
            const isTomorrow = index === 1;
            
            let label = '';
            if (isToday) label = 'Today';
            else if (isTomorrow) label = 'Tomorrow';
            else label = date.toLocaleDateString('en-US', { weekday: 'short' });
            
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            return `
                <button class="date-option border-2 border-gray-200 rounded-xl p-3 text-center hover:border-orange-300 transition-colors ${index === 0 ? 'selected border-orange-500 bg-orange-50' : ''}" 
                        data-date="${date.toISOString().split('T')[0]}"
                        onclick="bookingManager.selectDate('${date.toISOString().split('T')[0]}', this)">
                    <div class="font-medium text-gray-800">${label}</div>
                    <div class="text-sm text-gray-600">${dateStr}</div>
                </button>
            `;
        }).join('');
        
        // Select today by default
        this.bookingData.selectedDate = dates[0].toISOString().split('T')[0];
    }
    
    generateTimeSlots() {
        const container = document.getElementById('timeSlots');
        if (!container) return;
        
        const slots = [
            '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
            '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
            '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
        ];
        
        // For demo, make some slots unavailable
        const unavailableSlots = ['11:00 AM', '2:00 PM', '6:00 PM'];
        
        container.innerHTML = slots.map(slot => {
            const isUnavailable = unavailableSlots.includes(slot);
            
            return `
                <button class="time-slot border-2 border-gray-200 rounded-lg p-3 text-sm font-medium text-center hover:border-orange-300 transition-colors ${isUnavailable ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}" 
                        data-time="${slot}"
                        onclick="bookingManager.selectTime('${slot}', this)"
                        ${isUnavailable ? 'disabled' : ''}>
                    ${slot}
                    ${isUnavailable ? '<div class="text-xs text-red-500 mt-1">Unavailable</div>' : ''}
                </button>
            `;
        }).join('');
    }
    
    bindEvents() {
        // Payment method selection
        document.querySelectorAll('.payment-method').forEach(method => {
            method.addEventListener('click', () => {
                this.selectPaymentMethod(method.dataset.method, method);
            });
        });
        
        // Instructions textarea
        document.getElementById('instructions')?.addEventListener('input', (e) => {
            this.bookingData.instructions = e.target.value;
        });
        
        // Terms checkbox
        document.getElementById('agreeTerms')?.addEventListener('change', (e) => {
            this.validateForm();
        });
        
        // Confirm booking button
        document.getElementById('confirmBookingBtn')?.addEventListener('click', () => {
            this.confirmBooking();
        });
        
        // Track booking button
        document.getElementById('trackBookingBtn')?.addEventListener('click', () => {
            this.trackBooking();
        });
        
        // Initial validation
        this.validateForm();
    }
    
    selectDate(date, element) {
        // Remove previous selection
        document.querySelectorAll('.date-option').forEach(option => {
            option.classList.remove('selected', 'border-orange-500', 'bg-orange-50');
            option.classList.add('border-gray-200');
        });
        
        // Add selection to clicked element
        element.classList.add('selected', 'border-orange-500', 'bg-orange-50');
        element.classList.remove('border-gray-200');
        
        this.bookingData.selectedDate = date;
        this.updateSummary();
        this.validateForm();
        
        app.trackEvent('booking_date_selected', { date: date });
    }
    
    selectTime(time, element) {
        // Remove previous selection
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });
        
        // Add selection to clicked element
        element.classList.add('selected');
        
        this.bookingData.selectedTime = time;
        this.updateSummary();
        this.validateForm();
        
        app.trackEvent('booking_time_selected', { time: time });
    }
    
    selectPaymentMethod(method, element) {
        // Remove previous selection
        document.querySelectorAll('.payment-method').forEach(payment => {
            payment.classList.remove('selected');
            payment.querySelector('.w-3').classList.add('hidden');
        });
        
        // Add selection to clicked element
        element.classList.add('selected');
        element.querySelector('.w-3').classList.remove('hidden');
        
        this.bookingData.paymentMethod = method;
        
        app.trackEvent('payment_method_selected', { method: method });
    }
    
    updateContactDetails() {
        document.getElementById('phoneNumber').value = `+91 ${this.bookingData.phone}`;
        document.getElementById('serviceAddress').value = this.bookingData.address;
    }
    
    updateSummary() {
        if (this.service) {
            document.getElementById('summaryService').textContent = this.service.name_en;
        }
        
        if (this.provider) {
            document.getElementById('summaryProvider').textContent = this.provider.name;
        }
        
        document.getElementById('summaryLocation').textContent = this.bookingData.pinCode;
        
        // Update date and time
        let dateTimeText = 'Select time';
        if (this.bookingData.selectedDate && this.bookingData.selectedTime) {
            const date = new Date(this.bookingData.selectedDate);
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            dateTimeText = `${dateStr}, ${this.bookingData.selectedTime}`;
        } else if (this.bookingData.selectedDate) {
            const date = new Date(this.bookingData.selectedDate);
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            dateTimeText = `${dateStr} - Select time`;
        }
        
        document.getElementById('summaryDateTime').textContent = dateTimeText;
        
        // Update pricing
        if (this.provider) {
            const basePrice = this.provider.hourly_rate;
            const serviceFee = Math.round(basePrice * 0.07); // 7% service fee
            const taxes = Math.round((basePrice + serviceFee) * 0.08); // 8% taxes
            const total = basePrice + serviceFee + taxes;
            
            document.getElementById('basePrice').textContent = `₹${basePrice}`;
            document.getElementById('serviceFee').textContent = `₹${serviceFee}`;
            document.getElementById('taxes').textContent = `₹${taxes}`;
            document.getElementById('totalAmount').textContent = `₹${total}`;
            
            this.bookingData.estimatedPrice = total;
        }
    }
    
    validateForm() {
        const hasDate = this.bookingData.selectedDate;
        const hasTime = this.bookingData.selectedTime;
        const hasAgreedTerms = document.getElementById('agreeTerms')?.checked;
        
        const isValid = hasDate && hasTime && hasAgreedTerms;
        
        const confirmBtn = document.getElementById('confirmBookingBtn');
        confirmBtn.disabled = !isValid;
        
        if (isValid) {
            confirmBtn.classList.remove('bg-gray-300', 'cursor-not-allowed');
            confirmBtn.classList.add('bg-orange-500', 'hover:bg-orange-600');
        } else {
            confirmBtn.classList.add('bg-gray-300', 'cursor-not-allowed');
            confirmBtn.classList.remove('bg-orange-500', 'hover:bg-orange-600');
        }
    }
    
    async confirmBooking() {
        if (!this.validateBookingData()) {
            alert('Please complete all required fields.');
            return;
        }
        
        const confirmBtn = document.getElementById('confirmBookingBtn');
        const originalText = confirmBtn.innerHTML;
        
        // Show loading state
        confirmBtn.innerHTML = `
            <i class="fas fa-spinner fa-spin mr-2"></i>
            Processing...
        `;
        confirmBtn.disabled = true;
        
        try {
            // Create booking data
            const bookingPayload = {
                user_phone: this.bookingData.phone,
                provider_id: this.bookingData.providerId,
                service_id: this.bookingData.service,
                service_address: this.bookingData.address,
                pin_code: this.bookingData.pinCode,
                scheduled_datetime: this.getScheduledDateTime(),
                estimated_price: this.bookingData.estimatedPrice,
                payment_method: this.bookingData.paymentMethod,
                special_instructions: this.bookingData.instructions,
                status: 'pending',
                payment_status: 'pending'
            };
            
            // Submit booking
            const response = await fetch('tables/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookingPayload)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                this.showBookingConfirmation(result.id);
                app.trackEvent('booking_confirmed', {\n                    booking_id: result.id,\n                    service_id: this.bookingData.service,\n                    provider_id: this.bookingData.providerId,\n                    payment_method: this.bookingData.paymentMethod,\n                    estimated_price: this.bookingData.estimatedPrice\n                });\n            } else {\n                throw new Error(result.message || 'Booking failed');\n            }\n        } catch (error) {\n            console.error('Booking error:', error);\n            alert('Booking failed. Please try again.');\n            \n            // Reset button\n            confirmBtn.innerHTML = originalText;\n            confirmBtn.disabled = false;\n            \n            app.trackEvent('booking_failed', {\n                error: error.message,\n                service_id: this.bookingData.service\n            });\n        }\n    }\n    \n    validateBookingData() {\n        return (\n            this.bookingData.phone &&\n            this.bookingData.service &&\n            this.bookingData.providerId &&\n            this.bookingData.selectedDate &&\n            this.bookingData.selectedTime &&\n            this.bookingData.address\n        );\n    }\n    \n    getScheduledDateTime() {\n        if (!this.bookingData.selectedDate || !this.bookingData.selectedTime) {\n            return null;\n        }\n        \n        const date = new Date(this.bookingData.selectedDate);\n        const [time, period] = this.bookingData.selectedTime.split(' ');\n        const [hours, minutes] = time.split(':').map(Number);\n        \n        let adjustedHours = hours;\n        if (period === 'PM' && hours !== 12) {\n            adjustedHours += 12;\n        } else if (period === 'AM' && hours === 12) {\n            adjustedHours = 0;\n        }\n        \n        date.setHours(adjustedHours, minutes || 0, 0, 0);\n        return date.toISOString();\n    }\n    \n    showBookingConfirmation(bookingId) {\n        // Update booking ID in modal\n        document.getElementById('bookingId').textContent = `#JDK${bookingId.slice(-6).toUpperCase()}`;\n        \n        // Show confirmation modal\n        document.getElementById('confirmationModal').classList.remove('hidden');\n        document.body.style.overflow = 'hidden';\n        \n        // Send confirmation SMS/notification (simulated)\n        this.sendBookingConfirmation(bookingId);\n    }\n    \n    async sendBookingConfirmation(bookingId) {\n        try {\n            // This would integrate with SMS/WhatsApp API\n            const message = `Booking confirmed! Your ${this.service?.name_en} service is scheduled for ${this.bookingData.selectedDate} at ${this.bookingData.selectedTime}. Provider: ${this.provider?.name}. Booking ID: #JDK${bookingId.slice(-6).toUpperCase()}`;\n            \n            console.log('SMS sent:', message);\n            \n            // Simulate sending notification\n            if ('Notification' in window && Notification.permission === 'granted') {\n                new Notification('Jaldikaro - Booking Confirmed!', {\n                    body: 'Your service has been booked successfully.',\n                    icon: '/favicon.ico'\n                });\n            }\n        } catch (error) {\n            console.error('Error sending confirmation:', error);\n        }\n    }\n    \n    trackBooking() {\n        // Redirect to booking tracking page\n        window.location.href = 'tracking.html';\n    }\n    \n    updateUI() {\n        // Update page title and meta description\n        document.title = `Confirm ${this.service?.name_en || 'Service'} Booking - Jaldikaro`;\n    }\n}\n\n// Initialize booking manager\nconst bookingManager = new BookingManager();\n\n// Export for global access\nwindow.bookingManager = bookingManager;\n\n// Request notification permission\nif ('Notification' in window && Notification.permission === 'default') {\n    Notification.requestPermission();\n}