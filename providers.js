// Provider listing and management for Jaldikaro
class ProvidersManager {
    constructor() {
        this.providers = [];
        this.filteredProviders = [];
        this.searchParams = new URLSearchParams(window.location.search);
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.filters = {
            price: 'all',
            rating: 'all',
            distance: 'all',
            availableNow: false,
            verifiedOnly: false
        };
        this.sortBy = 'recommended';
        
        this.init();
    }
    
    init() {
        this.extractSearchParams();
        this.loadProviders();
        this.bindEvents();
        this.updateUI();
    }
    
    extractSearchParams() {
        this.searchData = {
            phone: this.searchParams.get('phone') || '',
            pinCode: this.searchParams.get('pinCode') || '',
            service: this.searchParams.get('service') || '',
            address: this.searchParams.get('address') || ''
        };
    }
    
    async loadProviders() {
        try {
            // Try to load from API first
            const response = await fetch(`tables/providers?service=${this.searchData.service}&pinCode=${this.searchData.pinCode}`);
            const result = await response.json();
            this.providers = result.data || this.getDefaultProviders();
        } catch (error) {
            console.error('Error loading providers:', error);
            this.providers = this.getDefaultProviders();
        }
        
        this.applyFiltersAndSort();
    }
    
    getDefaultProviders() {
        return [
            {
                id: 'p1',
                name: 'Rajesh Kumar',
                profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
                services: ['1'], // Carpenter
                rating: 4.8,
                total_reviews: 127,
                languages_spoken: ['English', 'Hindi'],
                experience_years: 8,
                hourly_rate: 350,
                is_verified: true,
                is_online: true,
                distance: 0.8,
                eta_minutes: 25,
                specialties: ['Furniture Repair', 'Door Fixing', 'Cabinet Work'],
                bio: 'Experienced carpenter with 8+ years in furniture and door repairs.',
                phone_number: '+91 9876543210'
            },
            {
                id: 'p2',
                name: 'Amit Singh',
                profile_image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
                services: ['1'], // Carpenter
                rating: 4.9,
                total_reviews: 89,
                languages_spoken: ['Hindi', 'Punjabi'],
                experience_years: 12,
                hourly_rate: 420,
                is_verified: true,
                is_online: true,
                distance: 1.2,
                eta_minutes: 35,
                specialties: ['Custom Furniture', 'Wood Carving', 'Repair Work'],
                bio: 'Master craftsman specializing in custom wooden furniture and intricate repair work.',
                phone_number: '+91 9876543211'
            },
            {
                id: 'p3',
                name: 'Ravi Electrician',
                profile_image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
                services: ['2'], // Electrician
                rating: 4.6,
                total_reviews: 156,
                languages_spoken: ['English', 'Hindi', 'Tamil'],
                experience_years: 6,
                hourly_rate: 300,
                is_verified: true,
                is_online: true,
                distance: 0.5,
                eta_minutes: 20,
                specialties: ['Wiring', 'Fan Installation', 'Switch Repair'],
                bio: 'Certified electrician with expertise in residential electrical work.',
                phone_number: '+91 9876543212'
            },
            {
                id: 'p4',
                name: 'Suresh Plumber',
                profile_image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face',
                services: ['3'], // Plumber
                rating: 4.7,
                total_reviews: 203,
                languages_spoken: ['Hindi', 'English'],
                experience_years: 10,
                hourly_rate: 280,
                is_verified: true,
                is_online: false,
                distance: 1.5,
                eta_minutes: 45,
                specialties: ['Pipe Repair', 'Bathroom Fitting', 'Water Heater'],
                bio: 'Professional plumber with 10+ years experience in all plumbing solutions.',
                phone_number: '+91 9876543213'
            },
            {
                id: 'p5',
                name: 'Pandit Sharma',
                profile_image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face',
                services: ['4'], // Pandit
                rating: 4.9,
                total_reviews: 78,
                languages_spoken: ['Hindi', 'Sanskrit', 'English'],
                experience_years: 15,
                hourly_rate: 500,
                is_verified: true,
                is_online: true,
                distance: 0.9,
                eta_minutes: 30,
                specialties: ['Puja Services', 'Astrology', 'Vedic Rituals'],
                bio: 'Experienced pandit for all Hindu religious ceremonies and consultations.',
                phone_number: '+91 9876543214'
            },
            {
                id: 'p6',
                name: 'Cleaning Lady Sunita',
                profile_image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
                services: ['5'], // Cleaner
                rating: 4.5,
                total_reviews: 234,
                languages_spoken: ['Hindi', 'English'],
                experience_years: 5,
                hourly_rate: 200,
                is_verified: true,
                is_online: true,
                distance: 0.7,
                eta_minutes: 22,
                specialties: ['Deep Cleaning', 'Regular Maintenance', 'Sanitization'],
                bio: 'Reliable cleaning professional with attention to detail.',
                phone_number: '+91 9876543215'
            }
        ];
    }
    
    bindEvents() {
        // Filter events
        document.querySelectorAll('input[name="price"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.filters.price = e.target.value;
                this.applyFiltersAndSort();
            });
        });
        
        document.querySelectorAll('input[name="rating"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.filters.rating = e.target.value;
                this.applyFiltersAndSort();
            });
        });
        
        document.querySelectorAll('input[name="distance"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.filters.distance = e.target.value;
                this.applyFiltersAndSort();
            });
        });
        
        document.getElementById('availableNow')?.addEventListener('change', (e) => {
            this.filters.availableNow = e.target.checked;
            this.applyFiltersAndSort();
        });
        
        document.getElementById('verifiedOnly')?.addEventListener('change', (e) => {
            this.filters.verifiedOnly = e.target.checked;
            this.applyFiltersAndSort();
        });
        
        // Sort event
        document.getElementById('sortBy')?.addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.applyFiltersAndSort();
        });
        
        // Clear filters
        document.getElementById('clearFilters')?.addEventListener('click', () => {
            this.clearAllFilters();
        });
        
        // Mobile filters
        document.getElementById('mobileFiltersBtn')?.addEventListener('click', () => {
            this.showMobileFilters();
        });
        
        document.getElementById('closeMobileFilters')?.addEventListener('click', () => {
            this.hideMobileFilters();
        });
        
        // Load more
        document.getElementById('loadMoreBtn')?.addEventListener('click', () => {
            this.loadMoreProviders();
        });
        
        // Modal events
        document.getElementById('closeModal')?.addEventListener('click', () => {
            this.hideModal();
        });
        
        // Click outside modal to close
        document.getElementById('providerModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'providerModal') {
                this.hideModal();
            }
        });
        
        // Emergency button
        document.getElementById('emergencyBtn')?.addEventListener('click', () => {
            this.handleEmergency();
        });
    }
    
    async updateUI() {
        // Update service name in header
        try {
            const service = await servicesManager.getServiceById(this.searchData.service);
            if (service) {
                document.getElementById('serviceType').textContent = service.name_en;
                document.getElementById('serviceNameHeader').textContent = service.name_en;
            }
        } catch (error) {
            console.error('Error updating UI:', error);
        }
        
        // Update location
        document.getElementById('locationArea').textContent = this.searchData.pinCode;
    }
    
    applyFiltersAndSort() {
        let filtered = [...this.providers];
        
        // Apply price filter
        if (this.filters.price !== 'all') {
            filtered = filtered.filter(provider => {
                const price = provider.hourly_rate;
                switch (this.filters.price) {
                    case 'budget': return price <= 300;
                    case 'medium': return price > 300 && price <= 500;
                    case 'premium': return price > 500;
                    default: return true;
                }
            });
        }
        
        // Apply rating filter
        if (this.filters.rating !== 'all') {
            const minRating = parseFloat(this.filters.rating.replace('+', ''));
            filtered = filtered.filter(provider => provider.rating >= minRating);
        }
        
        // Apply distance filter
        if (this.filters.distance !== 'all') {
            const maxDistance = parseFloat(this.filters.distance);
            filtered = filtered.filter(provider => provider.distance <= maxDistance);
        }
        
        // Apply availability filter
        if (this.filters.availableNow) {
            filtered = filtered.filter(provider => provider.is_online);
        }
        
        // Apply verified filter
        if (this.filters.verifiedOnly) {
            filtered = filtered.filter(provider => provider.is_verified);
        }
        
        // Apply sorting
        filtered.sort((a, b) => {
            switch (this.sortBy) {
                case 'price_low':
                    return a.hourly_rate - b.hourly_rate;
                case 'price_high':
                    return b.hourly_rate - a.hourly_rate;
                case 'rating':
                    return b.rating - a.rating;
                case 'distance':
                    return a.distance - b.distance;
                case 'recommended':
                default:
                    // Recommended: balance of rating, distance, and availability
                    const scoreA = (a.rating * 0.4) + ((2 - a.distance) * 0.3) + (a.is_online ? 0.3 : 0);
                    const scoreB = (b.rating * 0.4) + ((2 - b.distance) * 0.3) + (b.is_online ? 0.3 : 0);
                    return scoreB - scoreA;
            }
        });
        
        this.filteredProviders = filtered;
        this.currentPage = 1;
        this.renderProviders();
        this.updateResultsCount();
    }
    
    renderProviders() {
        const container = document.getElementById('providersGrid');
        if (!container) return;
        
        const startIndex = 0;
        const endIndex = this.currentPage * this.itemsPerPage;
        const providersToShow = this.filteredProviders.slice(startIndex, endIndex);
        
        if (providersToShow.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-search text-4xl text-gray-300 mb-4"></i>
                    <h3 class="text-lg font-medium text-gray-500 mb-2">No providers found</h3>
                    <p class="text-gray-400">Try adjusting your filters or search in a different area.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = providersToShow.map(provider => this.renderProviderCard(provider)).join('');
        
        // Update load more button visibility
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (endIndex >= this.filteredProviders.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }
    
    renderProviderCard(provider) {
        const isOnline = provider.is_online;
        const isVerified = provider.is_verified;
        
        return `
            <div class="provider-card bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer" 
                 onclick="providersManager.showProviderProfile('${provider.id}')">
                <div class="flex items-start space-x-4">
                    <!-- Provider Avatar -->
                    <div class="relative">
                        <img src="${provider.profile_image}" alt="${provider.name}" 
                             class="w-16 h-16 rounded-full object-cover">
                        ${isOnline ? '<div class="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>' : ''}
                    </div>
                    
                    <!-- Provider Info -->
                    <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between">
                            <div>
                                <div class="flex items-center space-x-2 mb-1">
                                    <h3 class="text-lg font-semibold text-gray-800">${provider.name}</h3>
                                    ${isVerified ? '<i class="fas fa-check-circle text-blue-500 text-sm"></i>' : ''}
                                </div>
                                
                                <!-- Rating & Reviews -->
                                <div class="flex items-center space-x-3 mb-2">
                                    <div class="flex items-center space-x-1">
                                        <div class="rating-stars">
                                            ${this.renderStars(provider.rating)}
                                        </div>
                                        <span class="text-sm font-medium text-gray-700">${provider.rating}</span>
                                    </div>
                                    <span class="text-sm text-gray-500">(${provider.total_reviews} reviews)</span>
                                </div>
                                
                                <!-- Distance & ETA -->
                                <div class="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                    <div class="flex items-center space-x-1">
                                        <i class="fas fa-map-marker-alt text-gray-400"></i>
                                        <span>${provider.distance} km away</span>
                                    </div>
                                    <div class="flex items-center space-x-1">
                                        <i class="fas fa-clock text-gray-400"></i>
                                        <span>${provider.eta_minutes} mins</span>
                                    </div>
                                    <div class="flex items-center space-x-1">
                                        <i class="fas fa-calendar-alt text-gray-400"></i>
                                        <span>${provider.experience_years}+ years exp</span>
                                    </div>
                                </div>
                                
                                <!-- Specialties -->
                                <div class="flex flex-wrap gap-1 mb-3">
                                    ${provider.specialties.slice(0, 3).map(specialty => 
                                        `<span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">${specialty}</span>`
                                    ).join('')}
                                </div>
                                
                                <!-- Languages -->
                                <div class="flex items-center space-x-1 text-sm text-gray-500">
                                    <i class="fas fa-language text-gray-400"></i>
                                    <span>${provider.languages_spoken.join(', ')}</span>
                                </div>
                            </div>
                            
                            <!-- Price & Book Button -->
                            <div class="text-right ml-4">
                                <div class="text-xl font-bold text-gray-800 mb-1">₹${provider.hourly_rate}</div>
                                <div class="text-sm text-gray-500 mb-3">/hour</div>
                                
                                <button onclick="event.stopPropagation(); providersManager.quickBook('${provider.id}')" 
                                        class="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors ${!isOnline ? 'opacity-50 cursor-not-allowed' : ''}" 
                                        ${!isOnline ? 'disabled' : ''}>
                                    ${isOnline ? 'Book Now' : 'Unavailable'}
                                </button>
                                
                                <div class="text-xs text-gray-500 mt-1">
                                    ${isOnline ? 'Available now' : 'Offline'}
                                </div>
                            </div>
                        </div>
                    </div>
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
    
    updateResultsCount() {
        document.getElementById('providersCount').textContent = `${this.filteredProviders.length} providers`;
        document.getElementById('resultsCount').textContent = this.filteredProviders.length;
    }
    
    clearAllFilters() {
        // Reset filters
        this.filters = {
            price: 'all',
            rating: 'all',
            distance: 'all',
            availableNow: false,
            verifiedOnly: false
        };
        
        // Reset form elements
        document.querySelectorAll('input[name="price"][value="all"]')[0].checked = true;
        document.querySelectorAll('input[name="rating"][value="all"]')[0].checked = true;
        document.querySelectorAll('input[name="distance"][value="all"]')[0].checked = true;
        document.getElementById('availableNow').checked = false;
        document.getElementById('verifiedOnly').checked = false;
        
        // Reset sort
        this.sortBy = 'recommended';
        document.getElementById('sortBy').value = 'recommended';
        
        // Re-apply filters
        this.applyFiltersAndSort();
        
        app.trackEvent('filters_cleared');
    }
    
    loadMoreProviders() {
        this.currentPage++;
        this.renderProviders();
        
        app.trackEvent('load_more_providers', { page: this.currentPage });
    }
    
    showProviderProfile(providerId) {
        const provider = this.providers.find(p => p.id === providerId);
        if (!provider) return;
        
        const modal = document.getElementById('providerModal');
        const content = document.getElementById('modalContent');
        
        content.innerHTML = this.renderProviderProfile(provider);
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        app.trackEvent('provider_profile_viewed', { provider_id: providerId });
    }
    
    renderProviderProfile(provider) {
        return `
            <div class="space-y-6">
                <!-- Provider Header -->
                <div class="flex items-start space-x-4">
                    <div class="relative">
                        <img src="${provider.profile_image}" alt="${provider.name}" 
                             class="w-20 h-20 rounded-full object-cover">
                        ${provider.is_online ? '<div class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>' : ''}
                    </div>
                    
                    <div class="flex-1">
                        <div class="flex items-center space-x-2 mb-2">
                            <h2 class="text-2xl font-bold text-gray-800">${provider.name}</h2>
                            ${provider.is_verified ? '<i class="fas fa-check-circle text-blue-500"></i>' : ''}
                        </div>
                        
                        <div class="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <div class="flex items-center space-x-1">
                                ${this.renderStars(provider.rating)}
                                <span class="font-medium">${provider.rating} (${provider.total_reviews})</span>
                            </div>
                            <span>${provider.distance} km away</span>
                            <span>${provider.experience_years}+ years exp</span>
                        </div>
                        
                        <p class="text-gray-600">${provider.bio}</p>
                    </div>
                </div>
                
                <!-- Pricing -->
                <div class="bg-orange-50 rounded-xl p-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-2xl font-bold text-gray-800">₹${provider.hourly_rate}/hour</div>
                            <div class="text-sm text-gray-600">Estimated arrival: ${provider.eta_minutes} minutes</div>
                        </div>
                        <div class="text-right">
                            <div class="text-sm text-gray-500">Starting price</div>
                            <div class="text-lg font-semibold text-orange-600">₹${Math.round(provider.hourly_rate * 0.8)}</div>
                        </div>
                    </div>
                </div>
                
                <!-- Specialties -->
                <div>
                    <h3 class="text-lg font-semibold text-gray-800 mb-3">Specialties</h3>
                    <div class="flex flex-wrap gap-2">
                        ${provider.specialties.map(specialty => 
                            `<span class="px-3 py-2 bg-gray-100 text-gray-700 rounded-full text-sm">${specialty}</span>`
                        ).join('')}
                    </div>
                </div>
                
                <!-- Languages -->
                <div>
                    <h3 class="text-lg font-semibold text-gray-800 mb-3">Languages Spoken</h3>
                    <div class="flex items-center space-x-2">
                        <i class="fas fa-language text-orange-500"></i>
                        <span class="text-gray-700">${provider.languages_spoken.join(', ')}</span>
                    </div>
                </div>
                
                <!-- Contact Actions -->
                <div class="grid grid-cols-2 gap-4">
                    <button onclick="providersManager.callProvider('${provider.id}')" 
                            class="bg-blue-500 text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-blue-600 transition-colors">
                        <i class="fas fa-phone"></i>
                        <span>Call Now</span>
                    </button>
                    
                    <button onclick="providersManager.bookProvider('${provider.id}')" 
                            class="bg-orange-500 text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-orange-600 transition-colors ${!provider.is_online ? 'opacity-50 cursor-not-allowed' : ''}"
                            ${!provider.is_online ? 'disabled' : ''}>
                        <i class="fas fa-calendar-check"></i>
                        <span>${provider.is_online ? 'Book Service' : 'Unavailable'}</span>
                    </button>
                </div>
                
                <!-- Reviews Preview -->
                <div>
                    <h3 class="text-lg font-semibold text-gray-800 mb-3">Recent Reviews</h3>
                    <div class="space-y-3">
                        ${this.renderReviewsPreview(provider.id)}
                    </div>
                </div>
            </div>
        `;
    }
    
    renderReviewsPreview(providerId) {
        // Demo reviews - in real app, fetch from API
        const reviews = [
            {
                name: 'Priya S.',
                rating: 5,
                comment: 'Excellent work! Very professional and completed the job quickly.',
                date: '2 days ago'
            },
            {
                name: 'Arjun K.',
                rating: 4,
                comment: 'Good service, arrived on time and fixed the issue.',
                date: '1 week ago'
            }
        ];
        
        return reviews.map(review => `
            <div class="border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center space-x-2">
                        <span class="font-medium text-gray-800">${review.name}</span>
                        <div class="flex space-x-1">
                            ${this.renderStars(review.rating)}
                        </div>
                    </div>
                    <span class="text-sm text-gray-500">${review.date}</span>
                </div>
                <p class="text-gray-600 text-sm">${review.comment}</p>
            </div>
        `).join('');
    }
    
    hideModal() {
        document.getElementById('providerModal').classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
    
    showMobileFilters() {
        document.getElementById('mobileFiltersModal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
    
    hideMobileFilters() {
        document.getElementById('mobileFiltersModal').classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
    
    quickBook(providerId) {
        this.bookProvider(providerId);
    }
    
    bookProvider(providerId) {
        const provider = this.providers.find(p => p.id === providerId);
        if (!provider || !provider.is_online) {
            alert('This provider is currently unavailable.');
            return;
        }
        
        // Redirect to booking confirmation page
        const queryParams = new URLSearchParams({
            ...this.searchData,
            providerId: providerId
        }).toString();
        
        window.location.href = `booking.html?${queryParams}`;
        
        app.trackEvent('provider_booked', { provider_id: providerId });
    }
    
    callProvider(providerId) {
        const provider = this.providers.find(p => p.id === providerId);
        if (provider) {
            window.location.href = `tel:${provider.phone_number}`;
            app.trackEvent('provider_called', { provider_id: providerId });
        }
    }
    
    handleEmergency() {
        alert('Emergency services coming soon! For immediate help, please call: +91 9876543210');
        app.trackEvent('emergency_clicked', { page: 'providers' });
    }
}

// Initialize providers manager
const providersManager = new ProvidersManager();

// Export for global access
window.providersManager = providersManager;