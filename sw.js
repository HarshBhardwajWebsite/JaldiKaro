// Service Worker for Jaldikaro PWA
const CACHE_NAME = 'jaldikaro-v1.0.0';
const STATIC_CACHE = 'jaldikaro-static-v1.0.0';

// Assets to cache for offline functionality
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/providers.html',
  '/booking.html',
  '/admin.html',
  '/provider-signup.html',
  '/js/main.js',
  '/js/booking-flow.js',
  '/js/language.js',
  '/js/services.js',
  '/js/providers.js',
  '/js/booking.js',
  '/js/admin.js',
  '/js/provider-signup.js',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
  'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css'
];

// API endpoints that should be cached with network-first strategy
const API_ENDPOINTS = [
  '/tables/services',
  '/tables/providers',
  '/tables/bookings'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets...');
        return cache.addAll(STATIC_ASSETS.filter(url => !url.startsWith('https://')));
      })
      .then(() => {
        console.log('Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Error caching static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated successfully');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle network requests with caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Handle API requests with network-first strategy
  if (isApiRequest(request.url)) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }
  
  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(navigationHandler(request));
    return;
  }
  
  // Handle static assets with cache-first strategy
  if (isStaticAsset(request.url)) {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }
  
  // Handle external CDN resources
  if (isCdnResource(request.url)) {
    event.respondWith(staleWhileRevalidateStrategy(request));
    return;
  }
  
  // Default: network-first for everything else
  event.respondWith(networkFirstStrategy(request));
});

// Check if request is for API endpoint
function isApiRequest(url) {
  return API_ENDPOINTS.some(endpoint => url.includes(endpoint));
}

// Check if request is for static asset
function isStaticAsset(url) {
  return url.includes('/js/') || 
         url.includes('/css/') || 
         url.includes('/images/') ||
         url.includes('.html') ||
         url.includes('.json');
}

// Check if request is for CDN resource
function isCdnResource(url) {
  return url.includes('cdn.tailwindcss.com') ||
         url.includes('fonts.googleapis.com') ||
         url.includes('cdn.jsdelivr.net') ||
         url.includes('images.unsplash.com');
}

// Network-first strategy with cache fallback
async function networkFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', request.url);
    
    // Fallback to cache
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If no cache, return offline page for navigation requests
    if (request.mode === 'navigate') {
      return createOfflineResponse();
    }
    
    throw error;
  }
}

// Cache-first strategy with network fallback
async function cacheFirstStrategy(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Failed to fetch resource:', request.url);
    throw error;
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Fetch from network in background
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });
  
  // Return cached response immediately if available
  return cachedResponse || fetchPromise;
}

// Handle navigation requests (page loads)
async function navigationHandler(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Navigation network failed, trying cache');
    
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match('/index.html') || 
                          await cache.match('/');
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return createOfflineResponse();
  }
}

// Create offline response
function createOfflineResponse() {
  const offlineHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Offline - Jaldikaro</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            body { font-family: 'Inter', sans-serif; }
        </style>
    </head>
    <body class="bg-gray-50 flex items-center justify-center min-h-screen">
        <div class="text-center max-w-md mx-auto p-8">
            <div class="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
                </svg>
            </div>
            
            <h1 class="text-2xl font-bold text-gray-800 mb-4">You're Offline</h1>
            <p class="text-gray-600 mb-6">
                No internet connection. Please check your network and try again.
            </p>
            
            <button onclick="window.location.reload()" class="bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors">
                Try Again
            </button>
            
            <div class="mt-8 text-center">
                <div class="text-xl font-bold text-orange-500 mb-2">
                    🏠 Jaldikaro
                </div>
                <p class="text-sm text-gray-500">
                    Home services at your doorstep
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
  
  return new Response(offlineHTML, {
    status: 200,
    statusText: 'OK',
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  });
}

// Background sync for booking submissions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'booking-sync') {
    event.waitUntil(syncBookings());
  }
  
  if (event.tag === 'provider-sync') {
    event.waitUntil(syncProviderApplication());
  }
});

// Sync pending bookings when online
async function syncBookings() {
  try {
    // Get pending bookings from IndexedDB (would be implemented in real app)
    console.log('Syncing pending bookings...');
    
    // This would sync any pending booking requests that were made offline
    // For demo purposes, we'll just log it
    console.log('Booking sync completed');
  } catch (error) {
    console.error('Error syncing bookings:', error);
  }
}

// Sync pending provider applications when online
async function syncProviderApplication() {
  try {
    console.log('Syncing pending provider applications...');
    
    // This would sync any pending provider registration requests
    console.log('Provider application sync completed');
  } catch (error) {
    console.error('Error syncing provider applications:', error);
  }
}

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  const options = {
    body: 'You have a new booking update!',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/'
    },
    actions: [
      {
        action: 'view',
        title: 'View Details',
        icon: '/action-view.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/action-close.png'
      }
    ]
  };
  
  if (event.data) {
    const payload = event.data.json();
    options.body = payload.body || options.body;
    options.data.url = payload.url || options.data.url;
  }
  
  event.waitUntil(
    self.registration.showNotification('Jaldikaro', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

console.log('Service Worker loaded successfully');