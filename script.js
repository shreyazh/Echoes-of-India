// Global variables
let currentEraIndex = 0;
let isAudioPlaying = false;
let timelineInterval;

// Era data
const eras = [
    { name: "Indus Valley", period: "3300-1300 BCE", color: "#d97706" },
    { name: "Vedic Age", period: "1500-500 BCE", color: "#ea580c" },
    { name: "Mauryan Empire", period: "322-185 BCE", color: "#dc2626" },
    { name: "Mughal Era", period: "1526-1857 CE", color: "#7c3aed" },
    { name: "Colonial Period", period: "1858-1947 CE", color: "#2563eb" },
    { name: "Independence", period: "1947 CE", color: "#059669" }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeTimeline();
    startTimelineAnimation();
    initializeScrollAnimations();
});

// Mobile menu toggle
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('active');
}

// Initialize timeline
function initializeTimeline() {
    const markersContainer = document.getElementById('timelineMarkers');
    if (!markersContainer) return;

    markersContainer.innerHTML = '';
    
    eras.forEach((era, index) => {
        const marker = document.createElement('div');
        marker.className = `timeline-marker ${index === currentEraIndex ? 'active' : ''}`;
        marker.onclick = () => setCurrentEra(index);
        
        marker.innerHTML = `
            <div class="timeline-dot" style="background-color: ${era.color}"></div>
            <div class="timeline-info">
                <div class="timeline-era">${era.name}</div>
                <div class="timeline-period">${era.period}</div>
            </div>
        `;
        
        markersContainer.appendChild(marker);
    });
    
    updateCurrentEraDisplay();
}

// Set current era
function setCurrentEra(index) {
    currentEraIndex = index;
    updateTimelineMarkers();
    updateCurrentEraDisplay();
}

// Update timeline markers
function updateTimelineMarkers() {
    const markers = document.querySelectorAll('.timeline-marker');
    markers.forEach((marker, index) => {
        if (index === currentEraIndex) {
            marker.classList.add('active');
        } else {
            marker.classList.remove('active');
        }
    });
}

// Update current era display
function updateCurrentEraDisplay() {
    const currentEraElement = document.getElementById('currentEra');
    if (currentEraElement) {
        const era = eras[currentEraIndex];
        currentEraElement.textContent = `Currently Exploring: ${era.name}`;
        currentEraElement.style.backgroundColor = era.color;
    }
}

// Start timeline animation
function startTimelineAnimation() {
    timelineInterval = setInterval(() => {
        currentEraIndex = (currentEraIndex + 1) % eras.length;
        updateTimelineMarkers();
        updateCurrentEraDisplay();
    }, 3000);
}

// Stop timeline animation
function stopTimelineAnimation() {
    if (timelineInterval) {
        clearInterval(timelineInterval);
        timelineInterval = null;
    }
}

// Toggle audio
function toggleAudio() {
    const audioBtn = document.getElementById('audioBtn');
    const icon = audioBtn.querySelector('i');
    
    isAudioPlaying = !isAudioPlaying;
    
    if (isAudioPlaying) {
        icon.className = 'fas fa-pause';
        // Here you would start actual audio playback
        console.log('Starting audio playback...');
    } else {
        icon.className = 'fas fa-play';
        // Here you would pause actual audio playback
        console.log('Pausing audio playback...');
    }
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .timeline-card, .audio-card');
    animatedElements.forEach(el => observer.observe(el));
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    if (mobileMenu && mobileMenu.classList.contains('active')) {
        if (!mobileMenu.contains(event.target) && !menuBtn.contains(event.target)) {
            mobileMenu.classList.remove('active');
        }
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (window.innerWidth > 768 && mobileMenu) {
        mobileMenu.classList.remove('active');
    }
});

// Keyboard navigation support
document.addEventListener('keydown', function(event) {
    // ESC key closes mobile menu
    if (event.key === 'Escape') {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
        }
    }
    
    // Arrow keys for timeline navigation
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        const timelineMarkers = document.querySelector('.timeline-markers');
        if (timelineMarkers && document.activeElement.closest('.timeline-marker')) {
            event.preventDefault();
            stopTimelineAnimation();
            
            if (event.key === 'ArrowLeft') {
                currentEraIndex = currentEraIndex > 0 ? currentEraIndex - 1 : eras.length - 1;
            } else {
                currentEraIndex = (currentEraIndex + 1) % eras.length;
            }
            
            setCurrentEra(currentEraIndex);
        }
    }
    
    // Space bar for audio toggle
    if (event.code === 'Space' && document.activeElement.id === 'audioBtn') {
        event.preventDefault();
        toggleAudio();
    }
});

// Add focus styles for keyboard navigation
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .timeline-marker:focus,
        .audio-btn:focus,
        .card-btn:focus,
        .btn:focus,
        .nav-link:focus {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
        }
        
        .timeline-marker {
            cursor: pointer;
        }
        
        .timeline-marker:focus {
            outline: 2px solid var(--primary-color);
            outline-offset: 4px;
            border-radius: 4px;
        }
    `;
    document.head.appendChild(style);
    
    // Make timeline markers focusable
    const markers = document.querySelectorAll('.timeline-marker');
    markers.forEach(marker => {
        marker.setAttribute('tabindex', '0');
        marker.setAttribute('role', 'button');
        marker.setAttribute('aria-label', `Select ${marker.querySelector('.timeline-era').textContent} era`);
    });
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy loading for images (if needed)
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Error handling for missing elements
function safeQuerySelector(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Element not found: ${selector}`);
    }
    return element;
}

// Local storage for user preferences
function saveUserPreference(key, value) {
    try {
        localStorage.setItem(`echoes-india-${key}`, JSON.stringify(value));
    } catch (e) {
        console.warn('Could not save user preference:', e);
    }
}

function getUserPreference(key, defaultValue = null) {
    try {
        const stored = localStorage.getItem(`echoes-india-${key}`);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch (e) {
        console.warn('Could not load user preference:', e);
        return defaultValue;
    }
}

// Initialize user preferences
document.addEventListener('DOMContentLoaded', function() {
    // Load saved era preference
    const savedEra = getUserPreference('currentEra', 0);
    if (savedEra >= 0 && savedEra < eras.length) {
        currentEraIndex = savedEra;
        updateTimelineMarkers();
        updateCurrentEraDisplay();
    }
    
    // Save era changes
    const originalSetCurrentEra = setCurrentEra;
    setCurrentEra = function(index) {
        originalSetCurrentEra(index);
        saveUserPreference('currentEra', index);
    };
});