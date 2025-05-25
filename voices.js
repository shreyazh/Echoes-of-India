// Voices data
const voices = [
    {
        id: "matangini-hazra",
        name: "Matangini Hazra",
        era: "independence",
        period: "1869-1942",
        title: "The 73-Year-Old Revolutionary",
        description: "A fearless freedom fighter who led protests against British rule in Bengal, carrying the Indian flag even as she was shot.",
        story: 'At 73, when most would seek comfort, Matangini Hazra marched with the tricolor in her hands. "I will hoist the flag on the Tamluk police station," she declared. British bullets could not stop her spirit.',
        location: "Tamluk, Bengal",
        image: "https://via.placeholder.com/400x300/d97706/ffffff?text=Matangini+Hazra",
        audioLength: "4:32",
    },
    {
        id: "usha-mehta",
        name: "Usha Mehta",
        era: "independence",
        period: "1920-2000",
        title: "Voice of Secret Congress Radio",
        description: "A young woman who operated an underground radio station during the Quit India Movement, broadcasting hope to millions.",
        story: 'From a secret location in Bombay, 22-year-old Usha Mehta\'s voice reached every corner of India: "This is the Congress Radio calling..." Her broadcasts kept the freedom movement alive.',
        location: "Mumbai, Maharashtra",
        image: "https://via.placeholder.com/400x300/059669/ffffff?text=Usha+Mehta",
        audioLength: "5:18",
    },
    {
        id: "harappa-potter",
        name: "Kamala the Potter",
        era: "indus",
        period: "2600 BCE",
        title: "Master Artisan of Harappa",
        description: "A fictional but historically grounded story of a female potter whose intricate designs adorned the homes of the Indus Valley.",
        story: "Her hands shaped clay as her ancestors did, creating vessels that would outlast empires. In the bustling markets of Harappa, Kamala's pottery was prized for its perfect symmetry.",
        location: "Harappa, Indus Valley",
        image: "https://via.placeholder.com/400x300/d97706/ffffff?text=Kamala+Potter",
        audioLength: "3:45",
    },
    {
        id: "vedic-dalit",
        name: "Shambuka's Daughter",
        era: "vedic",
        period: "800 BCE",
        title: "Seeker of Knowledge",
        description: "A story of resilience from the margins of Vedic society, where knowledge was forbidden to the lower castes.",
        story: "Though society denied her the right to learn, she listened from the shadows as the Vedas were chanted. Her memory preserved what was meant to be forgotten.",
        location: "Gangetic Plains",
        image: "https://via.placeholder.com/400x300/ea580c/ffffff?text=Shambuka+Daughter",
        audioLength: "4:12",
    },
    {
        id: "tribal-fighter",
        name: "Birsa Munda",
        era: "colonial",
        period: "1875-1900",
        title: "The Tribal Messiah",
        description: "A tribal leader who fought against British colonial rule and the exploitation of indigenous communities.",
        story: 'In the forests of Jharkhand, Birsa Munda united the tribal communities against British oppression. "Abua raj seter jana, maharani raj tundu jana" - Our kingdom has come, the queen\'s rule is over.',
        location: "Jharkhand",
        image: "https://via.placeholder.com/400x300/2563eb/ffffff?text=Birsa+Munda",
        audioLength: "6:22",
    },
    {
        id: "mughal-courtesan",
        name: "Anarkali",
        era: "mughal",
        period: "1590 CE",
        title: "The Dancer Who Defied an Empire",
        description: "Beyond the legend lies a story of a woman who challenged the power structures of the Mughal court.",
        story: "In the marble halls of Akbar's court, her dance spoke of freedom. When love threatened the empire's order, she chose dignity over submission.",
        location: "Lahore, Mughal Empire",
        image: "https://via.placeholder.com/400x300/7c3aed/ffffff?text=Anarkali",
        audioLength: "5:03",
    }
];

const eraFilters = [
    { id: "all", name: "All Eras", color: "#6b7280" },
    { id: "indus", name: "Indus Valley", color: "#d97706" },
    { id: "vedic", name: "Vedic Age", color: "#ea580c" },
    { id: "mauryan", name: "Mauryan", color: "#dc2626" },
    { id: "mughal", name: "Mughal Era", color: "#7c3aed" },
    { id: "colonial", name: "Colonial", color: "#2563eb" },
    { id: "independence", name: "Independence", color: "#059669" }
];

// State
let currentFilter = "all";
let searchTerm = "";
let playingAudio = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeFilters();
    initializeSearch();
    renderVoices();
});

// Initialize filter buttons
function initializeFilters() {
    const filtersContainer = document.getElementById('eraFilters');
    if (!filtersContainer) return;

    filtersContainer.innerHTML = '';
    
    eraFilters.forEach(filter => {
        const button = document.createElement('button');
        button.className = `filter-btn ${filter.id === currentFilter ? 'active' : ''}`;
        button.textContent = filter.name;
        button.onclick = () => setFilter(filter.id);
        
        if (filter.id !== 'all') {
            button.style.setProperty('--filter-color', filter.color);
        }
        
        filtersContainer.appendChild(button);
    });
}

// Initialize search
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', function(e) {
        searchTerm = e.target.value.toLowerCase();
        renderVoices();
    });
}

// Set filter
function setFilter(filterId) {
    currentFilter = filterId;
    
    // Update filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeButton = Array.from(filterButtons).find(btn => 
        btn.textContent === eraFilters.find(f => f.id === filterId).name
    );
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    renderVoices();
}

// Filter voices
function getFilteredVoices() {
    return voices.filter(voice => {
        const matchesSearch = 
            voice.name.toLowerCase().includes(searchTerm) ||
            voice.title.toLowerCase().includes(searchTerm) ||
            voice.description.toLowerCase().includes(searchTerm) ||
            voice.story.toLowerCase().includes(searchTerm);
        
        const matchesEra = currentFilter === "all" || voice.era === currentFilter;
        
        return matchesSearch && matchesEra;
    });
}

// Render voices
function renderVoices() {
    const voicesGrid = document.getElementById('voicesGrid');
    const noResults = document.getElementById('noResults');
    
    if (!voicesGrid || !noResults) return;

    const filteredVoices = getFilteredVoices();
    
    if (filteredVoices.length === 0) {
        voicesGrid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    voicesGrid.style.display = 'grid';
    noResults.style.display = 'none';
    
    voicesGrid.innerHTML = '';
    
    filteredVoices.forEach(voice => {
        const voiceCard = createVoiceCard(voice);
        voicesGrid.appendChild(voiceCard);
    });
}

// Create voice card
function createVoiceCard(voice) {
    const card = document.createElement('div');
    card.className = 'voice-card';
    
    const eraColor = eraFilters.find(era => era.id === voice.era)?.color || '#6b7280';
    
    card.innerHTML = `
        <div class="voice-image">
            <img src="${voice.image}" alt="${voice.name}" loading="lazy">
            <div class="image-overlay"></div>
            <div class="image-content">
                <span class="era-badge" style="background-color: ${eraColor}">
                    ${voice.period}
                </span>
                <h3 class="voice-name">${voice.name}</h3>
            </div>
        </div>
        
        <div class="voice-header">
            <h4 class="voice-title">${voice.title}</h4>
            <p class="voice-location">${voice.location}</p>
        </div>
        
        <div class="voice-content">
            <p class="voice-description">${voice.description}</p>
            
            <div class="voice-story">
                <p class="voice-quote">"${voice.story}"</p>
            </div>
            
            <div class="voice-actions">
                <button class="play-btn" onclick="toggleAudio('${voice.id}')" id="playBtn-${voice.id}">
                    <i class="fas fa-play"></i>
                    <span>Listen</span>
                </button>
                <span class="audio-duration">${voice.audioLength}</span>
            </div>
        </div>
    `;
    
    return card;
}

// Toggle audio
function toggleAudio(voiceId) {
    const voice = voices.find(v => v.id === voiceId);
    const playBtn = document.getElementById(`playBtn-${voiceId}`);
    
    if (!voice || !playBtn) return;
    
    const icon = playBtn.querySelector('i');
    const text = playBtn.querySelector('span');
    
    // Stop currently playing audio
    if (playingAudio && playingAudio !== voiceId) {
        const currentPlayBtn = document.getElementById(`playBtn-${playingAudio}`);
        if (currentPlayBtn) {
            const currentIcon = currentPlayBtn.querySelector('i');
            const currentText = currentPlayBtn.querySelector('span');
            currentIcon.className = 'fas fa-play';
            currentText.textContent = 'Listen';
            currentPlayBtn.classList.remove('playing');
        }
    }
    
    // Toggle current audio
    if (playingAudio === voiceId) {
        // Stop audio
        icon.className = 'fas fa-play';
        text.textContent = 'Listen';
        playBtn.classList.remove('playing');
        playingAudio = null;
        console.log(`Stopping audio for ${voice.name}`);
    } else {
        // Start audio
        icon.className = 'fas fa-pause';
        text.textContent = 'Pause';
        playBtn.classList.add('playing');
        playingAudio = voiceId;
        console.log(`Playing audio for ${voice.name}`);
        
        // Here you would integrate with actual audio playback
        // For demo purposes, we'll simulate audio ending after the duration
        simulateAudioPlayback(voiceId, voice.audioLength);
    }
}

// Simulate audio playback
function simulateAudioPlayback(voiceId, duration) {
    // Convert duration string to milliseconds (simplified)
    const [minutes, seconds] = duration.split(':').map(Number);
    const durationMs = (minutes * 60 + seconds) * 1000;
    
    setTimeout(() => {
        if (playingAudio === voiceId) {
            const playBtn = document.getElementById(`playBtn-${voiceId}`);
            if (playBtn) {
                const icon = playBtn.querySelector('i');
                const text = playBtn.querySelector('span');
                icon.className = 'fas fa-play';
                text.textContent = 'Listen';
                playBtn.classList.remove('playing');
                playingAudio = null;
            }
        }
    }, durationMs);
}

// Clear filters
function clearFilters() {
    currentFilter = "all";
    searchTerm = "";
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = "";
    }
    
    initializeFilters();
    renderVoices();
}

// Mobile menu toggle (inherited from main script)
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    }
}

// Keyboard navigation for voices page
document.addEventListener('keydown', function(event) {
    // ESC key closes mobile menu
    if (event.key === 'Escape') {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
        }
        
        // Also stop any playing audio
        if (playingAudio) {
            toggleAudio(playingAudio);
        }
    }
    
    // Space bar for audio toggle when focused on play button
    if (event.code === 'Space' && event.target.classList.contains('play-btn')) {
        event.preventDefault();
        const voiceId = event.target.id.replace('playBtn-', '');
        toggleAudio(voiceId);
    }
});

// Add accessibility attributes
document.addEventListener('DOMContentLoaded', function() {
    // Add ARIA labels to filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.setAttribute('role', 'button');
        btn.setAttribute('aria-pressed', btn.classList.contains('active'));
    });
    
    // Add ARIA labels to play buttons
    const playButtons = document.querySelectorAll('.play-btn');
    playButtons.forEach(btn => {
        btn.setAttribute('aria-label', 'Play audio narration');
    });
});
