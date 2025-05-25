// Map locations data
const locations = [
    {
        id: "harappa",
        name: "Harappa",
        era: "indus",
        period: "2600-1900 BCE",
        coordinates: { x: 35, y: 25 },
        type: "city",
        story: "Major urban center of the Indus Valley Civilization",
        details: "One of the largest cities of the Indus Valley, known for its sophisticated urban planning and craft production.",
        significance: "Archaeological evidence shows advanced drainage systems and standardized weights and measures.",
        audioLength: "3:45",
    },
    {
        id: "mohenjodaro",
        name: "Mohenjodaro",
        era: "indus",
        period: "2500-1900 BCE",
        coordinates: { x: 32, y: 35 },
        type: "city",
        story: 'The "Mound of the Dead" - a marvel of ancient urban planning',
        details: "Famous for the Great Bath and sophisticated water management systems.",
        significance: "Represents the pinnacle of Indus Valley urban civilization.",
        audioLength: "4:20",
    },
    {
        id: "hastinapura",
        name: "Hastinapura",
        era: "vedic",
        period: "1200-800 BCE",
        coordinates: { x: 45, y: 20 },
        type: "city",
        story: "Legendary capital of the Kuru kingdom from the Mahabharata",
        details: "Archaeological excavations reveal continuous habitation from the Vedic period.",
        significance: "Important center of early Vedic culture and literature.",
        audioLength: "5:10",
    },
    {
        id: "pataliputra",
        name: "Pataliputra",
        era: "mauryan",
        period: "490 BCE-550 CE",
        coordinates: { x: 55, y: 30 },
        type: "capital",
        story: "Capital of the mighty Mauryan Empire under Chandragupta and Ashoka",
        details: "One of the largest cities in the ancient world, seat of the Mauryan administration.",
        significance: "Center of Buddhist learning and Ashoka's edicts on non-violence.",
        audioLength: "6:30",
    },
    {
        id: "delhi",
        name: "Delhi",
        era: "mughal",
        period: "1526-1857 CE",
        coordinates: { x: 48, y: 22 },
        type: "capital",
        story: "Seat of Mughal power and cultural synthesis",
        details: "Multiple cities built and rebuilt, from Tughlaqabad to Shahjahanabad.",
        significance: "Symbol of Indo-Islamic architecture and cultural fusion.",
        audioLength: "7:15",
    },
    {
        id: "calcutta",
        name: "Calcutta",
        era: "colonial",
        period: "1690-1947 CE",
        coordinates: { x: 65, y: 35 },
        type: "colonial",
        story: "Capital of British India and center of the Bengal Renaissance",
        details: "Hub of trade, education, and the independence movement.",
        significance: "Birthplace of modern Indian nationalism and cultural awakening.",
        audioLength: "5:45",
    },
    {
        id: "champaran",
        name: "Champaran",
        era: "independence",
        period: "1917 CE",
        coordinates: { x: 58, y: 28 },
        type: "movement",
        story: "Gandhi's first satyagraha in India",
        details: "Peasant uprising against indigo cultivation forced by British planters.",
        significance: "Marked the beginning of Gandhi's leadership in Indian independence.",
        audioLength: "4:55",
    },
    {
        id: "jallianwala",
        name: "Jallianwala Bagh",
        era: "independence",
        period: "1919 CE",
        coordinates: { x: 42, y: 18 },
        type: "massacre",
        story: "Site of the brutal massacre that galvanized the independence movement",
        details: "British troops fired on unarmed civilians, killing hundreds.",
        significance: "Turning point that united Indians against British rule.",
        audioLength: "6:00",
    }
];

const mapEras = [
    { id: "all", name: "All Eras", color: "#6b7280" },
    { id: "indus", name: "Indus Valley", color: "#d97706" },
    { id: "vedic", name: "Vedic Age", color: "#ea580c" },
    { id: "mauryan", name: "Mauryan", color: "#dc2626" },
    { id: "mughal", name: "Mughal Era", color: "#7c3aed" },
    { id: "colonial", name: "Colonial", color: "#2563eb" },
    { id: "independence", name: "Independence", color: "#059669" }
];

// State
let selectedLocation = null;
let selectedEra = "all";

// Initialize map page
document.addEventListener('DOMContentLoaded', function() {
    initializeEraFilters();
    initializeMap();
    renderFeaturedLocations();
    updateLocationCount();
});

// Initialize era filters
function initializeEraFilters() {
    const filtersContainer = document.getElementById('eraFilters');
    if (!filtersContainer) return;

    filtersContainer.innerHTML = '';
    
    mapEras.forEach(era => {
        const button = document.createElement('button');
        button.className = `filter-btn ${era.id === selectedEra ? 'active' : ''}`;
        button.textContent = era.name;
        button.onclick = () => setEraFilter(era.id);
        
        if (era.id !== 'all') {
            button.style.setProperty('--filter-color', era.color);
        }
        
        filtersContainer.appendChild(button);
    });
}

// Set era filter
function setEraFilter(eraId) {
    selectedEra = eraId;
    
    // Update filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeButton = Array.from(filterButtons).find(btn => 
        btn.textContent === mapEras.find(e => e.id === eraId).name
    );
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    updateMapMarkers();
    updateLocationCount();
}

// Initialize map
function initializeMap() {
    const mapContainer = document.getElementById('indiaMap');
    if (!mapContainer) return;

    // Create SVG for India outline
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('class', 'map-svg');
    
    // India outline path (simplified)
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M20,15 Q25,10 35,12 Q45,8 55,10 Q65,12 75,15 Q80,20 82,30 Q85,40 83,50 Q80,60 75,70 Q70,80 60,85 Q50,88 40,85 Q30,82 25,75 Q20,65 18,55 Q15,45 17,35 Q18,25 20,15 Z');
    path.setAttribute('fill', 'rgba(245, 158, 11, 0.2)');
    path.setAttribute('stroke', 'rgba(245, 158, 11, 0.5)');
    path.setAttribute('stroke-width', '0.5');
    
    svg.appendChild(path);
    mapContainer.appendChild(svg);
    
    // Add location markers
    updateMapMarkers();
}

// Update map markers based on selected era
function updateMapMarkers() {
    const mapContainer = document.getElementById('indiaMap');
    if (!mapContainer) return;

    // Remove existing markers
    const existingMarkers = mapContainer.querySelectorAll('.location-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Filter locations based on selected era
    const filteredLocations = selectedEra === "all" 
        ? locations 
        : locations.filter(loc => loc.era === selectedEra);

    // Add new markers
    filteredLocations.forEach(location => {
        const marker = createLocationMarker(location);
        mapContainer.appendChild(marker);
    });
}

// Create location marker
function createLocationMarker(location) {
    const marker = document.createElement('div');
    marker.className = `location-marker ${selectedLocation === location.id ? 'active' : ''}`;
    marker.style.left = `${location.coordinates.x}%`;
    marker.style.top = `${location.coordinates.y}%`;
    marker.onclick = () => selectLocation(location.id);
    
    const eraColor = mapEras.find(era => era.id === location.era)?.color || '#6b7280';
    const icon = getLocationIcon(location.type);
    
    marker.innerHTML = `
        <div class="marker-dot" style="background-color: ${eraColor}">
            ${icon}
        </div>
        <div class="marker-tooltip">${location.name}</div>
    `;
    
    // Add accessibility attributes
    marker.setAttribute('tabindex', '0');
    marker.setAttribute('role', 'button');
    marker.setAttribute('aria-label', `Select ${location.name}`);
    
    // Keyboard support
    marker.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectLocation(location.id);
        }
    });
    
    return marker;
}

// Get location icon based on type
function getLocationIcon(type) {
    switch (type) {
        case "city": return "🏛️";
        case "capital": return "👑";
        case "colonial": return "🏢";
        case "movement": return "✊";
        case "massacre": return "🕯️";
        default: return "📍";
    }
}

// Select location
function selectLocation(locationId) {
    selectedLocation = locationId;
    
    // Update marker states
    const markers = document.querySelectorAll('.location-marker');
    markers.forEach(marker => {
        marker.classList.remove('active');
    });
    
    const activeMarker = Array.from(markers).find(marker => 
        marker.onclick.toString().includes(locationId)
    );
    if (activeMarker) {
        activeMarker.classList.add('active');
    }
    
    // Update details panel
    updateLocationDetails();
}

// Update location details panel
function updateLocationDetails() {
    const detailsContainer = document.getElementById('locationDetails');
    if (!detailsContainer) return;

    if (!selectedLocation) {
        detailsContainer.innerHTML = `
            <div class="no-selection">
                <i class="fas fa-map-pin map-icon"></i>
                <h3>Select a Location</h3>
                <p>Click on any marker on the map to explore its historical significance and hear its story.</p>
            </div>
        `;
        return;
    }

    const location = locations.find(loc => loc.id === selectedLocation);
    if (!location) return;

    const eraColor = mapEras.find(era => era.id === location.era)?.color || '#6b7280';
    
    detailsContainer.innerHTML = `
        <div class="location-info">
            <div class="location-header">
                <h3 class="location-name">${location.name}</h3>
                <span class="period-badge" style="background-color: ${eraColor}">
                    ${location.period}
                </span>
            </div>
            
            <p class="location-story">${location.story}</p>
            
            <div class="info-section historical-details">
                <h4>
                    <i class="fas fa-info-circle"></i>
                    Historical Details
                </h4>
                <p>${location.details}</p>
            </div>
            
            <div class="info-section significance-details">
                <h4>
                    <i class="fas fa-calendar-alt"></i>
                    Significance
                </h4>
                <p>${location.significance}</p>
            </div>
        </div>
        
        <div class="location-actions">
            <button class="listen-btn" onclick="playLocationAudio('${location.id}')">
                <i class="fas fa-play"></i>
                Listen to Story
            </button>
            <span class="audio-duration">${location.audioLength}</span>
        </div>
    `;
}

// Play location audio
function playLocationAudio(locationId) {
    const location = locations.find(loc => loc.id === locationId);
    if (!location) return;
    
    console.log(`Playing audio for ${location.name} (${location.audioLength})`);
    
    // Here you would integrate with actual audio playback
    // For demo purposes, we'll just log the action
    const btn = document.querySelector('.listen-btn');
    if (btn) {
        const icon = btn.querySelector('i');
        const originalText = btn.innerHTML;
        
        // Show playing state
        btn.innerHTML = '<i class="fas fa-pause"></i> Playing...';
        btn.disabled = true;
        
        // Simulate audio duration
        const [minutes, seconds] = location.audioLength.split(':').map(Number);
        const durationMs = (minutes * 60 + seconds) * 1000;
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, Math.min(durationMs, 3000)); // Cap at 3 seconds for demo
    }
}

// Render featured locations
function renderFeaturedLocations() {
    const gridContainer = document.getElementById('locationsGrid');
    if (!gridContainer) return;

    gridContainer.innerHTML = '';
    
    // Show first 6 locations
    const featuredLocations = locations.slice(0, 6);
    
    featuredLocations.forEach(location => {
        const card = createLocationCard(location);
        gridContainer.appendChild(card);
    });
}

// Create location card
function createLocationCard(location) {
    const card = document.createElement('div');
    card.className = 'location-card';
    card.onclick = () => {
        selectLocation(location.id);
        // Scroll to map section
        document.querySelector('.map-section').scrollIntoView({ 
            behavior: 'smooth' 
        });
    };
    
    const eraColor = mapEras.find(era => era.id === location.era)?.color || '#6b7280';
    const eraName = mapEras.find(era => era.id === location.era)?.name || location.era;
    const icon = getLocationIcon(location.type);
    
    card.innerHTML = `
        <div class="location-card-header">
            <div class="card-header-row">
                <h4 class="card-location-name">${location.name}</h4>
                <span class="card-era-badge" style="background-color: ${eraColor}">
                    ${eraName}
                </span>
            </div>
            <p class="card-period">${location.period}</p>
        </div>
        
        <div class="location-card-content">
            <div class="card-icon-container">
                <span class="card-icon">${icon}</span>
            </div>
            <p class="card-story">${location.story}</p>
            <div class="card-actions">
                <a href="#" class="card-listen-btn" onclick="event.stopPropagation(); playLocationAudio('${location.id}')">
                    <i class="fas fa-play"></i>
                    Listen
                </a>
                <span class="card-duration">${location.audioLength}</span>
            </div>
        </div>
    `;
    
    // Add accessibility attributes
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Explore ${location.name}`);
    
    // Keyboard support
    card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.click();
        }
    });
    
    return card;
}

// Update location count
function updateLocationCount() {
    const countElement = document.getElementById('locationCount');
    if (!countElement) return;

    const filteredCount = selectedEra === "all" 
        ? locations.length 
        : locations.filter(loc => loc.era === selectedEra).length;
    
    countElement.textContent = filteredCount;
}

// Mobile menu toggle (inherited from main script)
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    }
}

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    // ESC key closes mobile menu and deselects location
    if (event.key === 'Escape') {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
        } else if (selectedLocation) {
            selectedLocation = null;
            updateMapMarkers();
            updateLocationDetails();
        }
    }
    
    // Arrow keys for location navigation
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        if (document.activeElement.classList.contains('location-marker')) {
            event.preventDefault();
            
            const currentIndex = locations.findIndex(loc => loc.id === selectedLocation);
            let newIndex;
            
            if (event.key === 'ArrowLeft') {
                newIndex = currentIndex > 0 ? currentIndex - 1 : locations.length - 1;
            } else {
                newIndex = (currentIndex + 1) % locations.length;
            }
            
            selectLocation(locations[newIndex].id);
        }
    }
});