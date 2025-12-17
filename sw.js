const CACHE_NAME = 'sharl-tech-v1';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './images/logo.jpg'
];

// Install Event
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
    );
});

// Fetch Event
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request)
            .then((response) => response || fetch(e.request))
    );
});
