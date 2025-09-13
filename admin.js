// Admin dashboard management for Jaldikaro
class AdminManager {
    constructor() {
        this.currentSection = 'dashboard';
        this.charts = {};
        this.init();
    }
    
    init() {
        this.bindNavigation();
        this.loadDashboardData();
        this.initializeCharts();
        this.loadRecentActivity();
    }
    
    bindNavigation() {
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.switchSection(section);
            });
        });
        
        // Export buttons
        document.getElementById('exportBookings')?.addEventListener('click', () => {
            this.exportBookings();
        });
        
        // Add service button
        document.getElementById('addServiceBtn')?.addEventListener('click', () => {
            this.showAddServiceModal();
        });
    }
    
    switchSection(section) {
        // Update active navigation
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.classList.remove('active');
        });
        
        document.querySelector(`[data-section="${section}"]`).classList.add('active');
        
        // Hide all sections
        document.querySelectorAll('.admin-section').forEach(sec => {
            sec.classList.add('hidden');
        });
        
        // Show selected section
        document.getElementById(`${section}-section`)?.classList.remove('hidden');
        
        this.currentSection = section;
        
        // Load section-specific data
        switch (section) {
            case 'bookings':
                this.loadBookings();
                break;
            case 'providers':
                this.loadProviders();
                break;
            case 'services':
                this.loadServices();
                break;
            case 'users':
                this.loadUsers();
                break;
            case 'analytics':
                this.loadAnalytics();
                break;
        }
        
        app.trackEvent('admin_section_changed', { section: section });
    }
    
    async loadDashboardData() {
        try {
            // Load dashboard statistics
            const stats = await this.getDashboardStats();
            this.updateDashboardStats(stats);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.updateDashboardStats(this.getDefaultStats());
        }
    }
    
    async getDashboardStats() {
        try {
            // In a real app, these would be separate API calls
            const [bookings, providers, users, revenue] = await Promise.all([
                fetch('tables/bookings').then(r => r.json()),
                fetch('tables/providers').then(r => r.json()),
                fetch('tables/users').then(r => r.json()),
                this.calculateRevenue()
            ]);
            
            return {
                totalBookings: bookings.total || 1234,
                activeProviders: providers.data?.filter(p => p.is_online)?.length || 156,
                totalRevenue: revenue || 89432,
                avgRating: 4.8
            };
        } catch (error) {
            return this.getDefaultStats();
        }
    }
    
    getDefaultStats() {
        return {
            totalBookings: 1234,
            activeProviders: 156,
            totalRevenue: 89432,
            avgRating: 4.8
        };
    }
    
    updateDashboardStats(stats) {
        document.getElementById('totalBookings').textContent = stats.totalBookings.toLocaleString();
        document.getElementById('activeProviders').textContent = stats.activeProviders.toLocaleString();
        document.getElementById('totalRevenue').textContent = `₹${stats.totalRevenue.toLocaleString()}`;
        document.getElementById('avgRating').textContent = stats.avgRating;
    }
    
    initializeCharts() {
        this.initBookingsChart();
        this.initServicesChart();
    }
    
    initBookingsChart() {
        const ctx = document.getElementById('bookingsChart');
        if (!ctx) return;
        
        this.charts.bookings = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Bookings',
                    data: [120, 150, 180, 220, 280, 320, 380],
                    borderColor: '#f97316',
                    backgroundColor: 'rgba(249, 115, 22, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#f3f4f6'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    initServicesChart() {
        const ctx = document.getElementById('servicesChart');
        if (!ctx) return;
        
        this.charts.services = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Carpenter', 'Electrician', 'Plumber', 'Cleaner', 'Others'],
                datasets: [{
                    data: [30, 25, 20, 15, 10],
                    backgroundColor: [
                        '#f97316',
                        '#3b82f6',
                        '#10b981',
                        '#f59e0b',
                        '#6b7280'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }
    
    async loadRecentActivity() {
        const container = document.getElementById('recentActivity');
        if (!container) return;
        
        // Demo activity data
        const activities = [
            {
                type: 'booking',
                message: 'New booking received from Priya Sharma for Carpenter service',
                time: '2 minutes ago',
                icon: 'fas fa-calendar-plus',
                iconColor: 'text-green-500'
            },
            {
                type: 'provider',
                message: 'New provider registration: Amit Electrician',
                time: '15 minutes ago',
                icon: 'fas fa-user-plus',
                iconColor: 'text-blue-500'
            },
            {
                type: 'booking',
                message: 'Booking #JDK123456 completed successfully',
                time: '1 hour ago',
                icon: 'fas fa-check-circle',
                iconColor: 'text-green-500'
            },
            {
                type: 'payment',
                message: 'Payment of ₹450 received for booking #JDK123455',
                time: '2 hours ago',
                icon: 'fas fa-rupee-sign',
                iconColor: 'text-orange-500'
            },
            {
                type: 'review',
                message: 'New 5-star review received for Rajesh Kumar',
                time: '3 hours ago',
                icon: 'fas fa-star',
                iconColor: 'text-yellow-500'
            }
        ];
        
        container.innerHTML = activities.map(activity => `
            <div class="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <i class="${activity.icon} ${activity.iconColor}"></i>
                </div>
                <div class="flex-1">
                    <p class="text-gray-800 text-sm">${activity.message}</p>
                    <p class="text-gray-500 text-xs">${activity.time}</p>
                </div>
            </div>
        `).join('');
    }
    
    async loadBookings() {
        try {
            const response = await fetch('tables/bookings');
            const result = await response.json();
            const bookings = result.data || this.getDefaultBookings();
            
            this.renderBookingsTable(bookings);
        } catch (error) {
            console.error('Error loading bookings:', error);
            this.renderBookingsTable(this.getDefaultBookings());
        }
    }
    
    getDefaultBookings() {
        return [
            {
                id: 'JDK123456',
                customer_phone: '+91 9876543210',
                service_name: 'Carpenter',
                provider_name: 'Rajesh Kumar',
                scheduled_datetime: '2024-01-15T10:00:00Z',
                status: 'confirmed',
                estimated_price: 450
            },
            {
                id: 'JDK123457',
                customer_phone: '+91 9876543211',
                service_name: 'Electrician',
                provider_name: 'Amit Singh',
                scheduled_datetime: '2024-01-15T14:00:00Z',
                status: 'pending',
                estimated_price: 350
            }
        ];
    }
    
    renderBookingsTable(bookings) {
        const tbody = document.getElementById('bookingsTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = bookings.map(booking => `
            <tr class="border-b hover:bg-gray-50">
                <td class="py-4 px-6 text-sm font-mono">#${booking.id}</td>
                <td class="py-4 px-6 text-sm">${booking.customer_phone}</td>
                <td class="py-4 px-6 text-sm">${booking.service_name}</td>
                <td class="py-4 px-6 text-sm">${booking.provider_name}</td>
                <td class="py-4 px-6 text-sm">${new Date(booking.scheduled_datetime).toLocaleDateString()}</td>
                <td class="py-4 px-6">
                    <span class="px-2 py-1 rounded-full text-xs font-medium ${this.getStatusBadge(booking.status)}">
                        ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                </td>
                <td class="py-4 px-6 text-sm font-medium">₹${booking.estimated_price}</td>
                <td class="py-4 px-6">
                    <button class="text-orange-500 hover:text-orange-600 text-sm font-medium mr-3" onclick="adminManager.viewBooking('${booking.id}')">
                        View
                    </button>
                    <button class="text-blue-500 hover:text-blue-600 text-sm font-medium" onclick="adminManager.editBooking('${booking.id}')">
                        Edit
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    getStatusBadge(status) {
        const badges = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            in_progress: 'bg-orange-100 text-orange-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return badges[status] || 'bg-gray-100 text-gray-800';
    }
    
    async loadProviders() {
        try {
            const response = await fetch('tables/providers');
            const result = await response.json();
            const providers = result.data || this.getDefaultProviders();
            
            this.renderProvidersTable(providers);
        } catch (error) {
            console.error('Error loading providers:', error);
            this.renderProvidersTable(this.getDefaultProviders());
        }
    }
    
    getDefaultProviders() {
        return [
            {
                id: 'p1',
                name: 'Rajesh Kumar',
                profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
                services: ['Carpenter'],
                rating: 4.8,
                total_reviews: 127,
                is_verified: true,
                is_online: true
            },
            {
                id: 'p2',
                name: 'Amit Singh',
                profile_image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
                services: ['Electrician'],
                rating: 4.9,
                total_reviews: 89,
                is_verified: true,
                is_online: false
            }
        ];
    }
    
    renderProvidersTable(providers) {
        const tbody = document.getElementById('providersTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = providers.map(provider => `
            <tr class="border-b hover:bg-gray-50">
                <td class="py-4 px-6">
                    <div class="flex items-center space-x-3">
                        <img src="${provider.profile_image}" alt="${provider.name}" 
                             class="w-10 h-10 rounded-full object-cover">
                        <div>
                            <div class="font-medium text-gray-800">${provider.name}</div>
                            ${provider.is_verified ? '<span class="text-xs text-blue-600">Verified</span>' : ''}
                        </div>
                    </div>
                </td>
                <td class="py-4 px-6 text-sm">${provider.services.join(', ')}</td>
                <td class="py-4 px-6">
                    <div class="flex items-center space-x-1">
                        <span class="text-sm font-medium">${provider.rating}</span>
                        <i class="fas fa-star text-yellow-400 text-xs"></i>
                        <span class="text-xs text-gray-500">(${provider.total_reviews})</span>
                    </div>
                </td>
                <td class="py-4 px-6 text-sm">${provider.total_reviews}</td>
                <td class="py-4 px-6">
                    <span class="px-2 py-1 rounded-full text-xs font-medium ${provider.is_online ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                        ${provider.is_online ? 'Online' : 'Offline'}
                    </span>
                </td>
                <td class="py-4 px-6">
                    <button class="text-orange-500 hover:text-orange-600 text-sm font-medium mr-3" onclick="adminManager.viewProvider('${provider.id}')">
                        View
                    </button>
                    <button class="text-blue-500 hover:text-blue-600 text-sm font-medium" onclick="adminManager.editProvider('${provider.id}')">
                        Edit
                    </button>
                </td>
            </tr>
        `).join('');
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
            <div class="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                <div class="flex items-center justify-between mb-4">
                    <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <i class="${service.icon} text-orange-500 text-xl"></i>
                    </div>
                    <div class="flex space-x-2">
                        <button class="text-blue-500 hover:text-blue-600" onclick="adminManager.editService('${service.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="text-red-500 hover:text-red-600" onclick="adminManager.deleteService('${service.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <h3 class="font-semibold text-gray-800 mb-2">${service.name_en}</h3>
                <p class="text-sm text-gray-600 mb-3">${service.description_en}</p>
                
                <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-500">Base Price:</span>
                    <span class="font-medium text-gray-800">₹${service.base_price}</span>
                </div>
                
                <div class="flex items-center justify-between text-sm mt-2">
                    <span class="text-gray-500">Status:</span>
                    <span class="px-2 py-1 rounded-full text-xs font-medium ${service.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                        ${service.is_active ? 'Active' : 'Inactive'}
                    </span>
                </div>
            </div>
        `).join('');
    }
    
    // Action methods
    viewBooking(bookingId) {
        alert(`Viewing booking ${bookingId} - Feature coming soon!`);
    }
    
    editBooking(bookingId) {
        alert(`Editing booking ${bookingId} - Feature coming soon!`);
    }
    
    viewProvider(providerId) {
        alert(`Viewing provider ${providerId} - Feature coming soon!`);
    }
    
    editProvider(providerId) {
        alert(`Editing provider ${providerId} - Feature coming soon!`);
    }
    
    editService(serviceId) {
        alert(`Editing service ${serviceId} - Feature coming soon!`);
    }
    
    deleteService(serviceId) {
        if (confirm('Are you sure you want to delete this service?')) {
            alert(`Deleting service ${serviceId} - Feature coming soon!`);
        }
    }
    
    showAddServiceModal() {
        alert('Add service modal - Feature coming soon!');
    }
    
    async exportBookings() {
        try {
            const response = await fetch('tables/bookings');
            const result = await response.json();
            const bookings = result.data || this.getDefaultBookings();
            
            // Convert to CSV
            const csvContent = this.arrayToCSV(bookings);
            
            // Download CSV
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `jaldikaro-bookings-${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
            
            app.trackEvent('admin_bookings_exported');
        } catch (error) {
            console.error('Error exporting bookings:', error);
            alert('Error exporting bookings. Please try again.');
        }
    }
    
    arrayToCSV(data) {
        if (!data.length) return '';
        
        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(',')];
        
        for (const row of data) {
            const values = headers.map(header => {
                const val = row[header];
                return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
            });
            csvRows.push(values.join(','));
        }
        
        return csvRows.join('\n');
    }
    
    async calculateRevenue() {
        // This would calculate actual revenue from bookings
        return 89432;
    }
}

// Initialize admin manager
const adminManager = new AdminManager();

// Export for global access
window.adminManager = adminManager;