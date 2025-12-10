let currentEngine = 'google';
const searchEngines = {
    google: 'https://www.google.com/search?q=',
    duckduckgo: 'https://duckduckgo.com/?q=',
    bing: 'https://www.bing.com/search?q='
};

// Search functionality
document.getElementById('search').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const query = this.value.trim();
        if (query) {
            updateSearchCount();
            window.location.href = searchEngines[currentEngine] + encodeURIComponent(query);
        }
    }
});

// Search engine selection
function setSearchEngine(engine) {
    currentEngine = engine;
    document.querySelectorAll('.engine').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-engine="${engine}"]`).classList.add('active');
    
    const placeholder = {
        google: 'Search Google...',
        duckduckgo: 'Search DuckDuckGo...',
        bing: 'Search Bing...'
    };
    document.getElementById('search').placeholder = placeholder[engine];
}

// Settings panel
function toggleSettings() {
    const panel = document.getElementById('settingsPanel');
    panel.classList.toggle('active');
}



// Set preset image
function setCustomImage(imagePath) {
    document.body.style.backgroundImage = `url("${imagePath}")`;
    document.body.className = 'custom';
    localStorage.setItem('bgTheme', 'preset');
    localStorage.setItem('presetImage', imagePath);
    
    // Clear all active states
    document.querySelectorAll('.image-option').forEach(opt => {
        opt.classList.remove('active');
    });
    
    // Set active image - find by onclick attribute
    const activeElement = Array.from(document.querySelectorAll('.image-option')).find(el => 
        el.getAttribute('onclick').includes(imagePath)
    );
    if (activeElement) {
        activeElement.classList.add('active');
    }
}

// Custom background upload
function uploadCustomBg(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageUrl = e.target.result;
            document.body.style.backgroundImage = `url("${imageUrl}")`;
            document.body.className = 'custom';
            localStorage.setItem('customBg', imageUrl);
            localStorage.setItem('bgTheme', 'custom');
            
            // Clear active states
            document.querySelectorAll('.image-option').forEach(opt => {
                opt.classList.remove('active');
            });
        };
        reader.readAsDataURL(file);
    }
}

// Time display
function updateTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    const dateStr = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('time').textContent = `${timeStr} | ${dateStr}`;
}

// Stats tracking
let sessionStart = Date.now();
let clickCount = parseInt(localStorage.getItem('dailyClicks') || '0');
let searchCount = parseInt(localStorage.getItem('dailySearches') || '0');
let lastDate = localStorage.getItem('lastVisitDate');

// Reset daily stats if new day
if (lastDate !== new Date().toDateString()) {
    clickCount = 0;
    searchCount = 0;
    localStorage.setItem('dailyClicks', '0');
    localStorage.setItem('dailySearches', '0');
    localStorage.setItem('lastVisitDate', new Date().toDateString());
}

// Update session time
function updateSessionTime() {
    const elapsed = Math.floor((Date.now() - sessionStart) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    document.getElementById('sessionTime').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Update click counter
function updateClickCount() {
    clickCount++;
    document.getElementById('clickCount').textContent = clickCount;
    localStorage.setItem('dailyClicks', clickCount.toString());
}

// Update search counter
function updateSearchCount() {
    searchCount++;
    document.getElementById('searchCount').textContent = searchCount;
    localStorage.setItem('dailySearches', searchCount.toString());
}

// Daily quotes
const quotes = [
    "The best way to predict the future is to create it. - Peter Drucker",
    "Code is like humor. When you have to explain it, it's bad. - Cory House",
    "First, solve the problem. Then, write the code. - John Johnson",
    "Experience is the name everyone gives to their mistakes. - Oscar Wilde",
    "In order to be irreplaceable, one must always be different. - Coco Chanel",
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Innovation distinguishes between a leader and a follower. - Steve Jobs",
    "Stay hungry, stay foolish. - Steve Jobs"
];

function setDailyQuote() {
    const today = new Date().getDate();
    const quote = quotes[today % quotes.length];
    document.getElementById('dailyQuote').textContent = quote;
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Load saved theme
    const savedTheme = localStorage.getItem('bgTheme');
    
    if (savedTheme === 'custom') {
        const customBg = localStorage.getItem('customBg');
        if (customBg) {
            document.body.style.backgroundImage = `url("${customBg}")`;
            document.body.className = 'custom';
        }
    } else if (savedTheme === 'preset') {
        const presetImage = localStorage.getItem('presetImage');
        if (presetImage) {
            setCustomImage(presetImage);
        }
    }
    
    // Initialize stats
    document.getElementById('clickCount').textContent = clickCount;
    document.getElementById('searchCount').textContent = searchCount;
    setDailyQuote();
    
    // Start timers
    updateTime();
    setInterval(updateTime, 1000);
    setInterval(updateSessionTime, 1000);
    
    // Track clicks
    document.addEventListener('click', updateClickCount);
    
    // Custom cursor tracking
    document.addEventListener('mousemove', (e) => {
        document.body.style.setProperty('--mouse-x', e.clientX + 'px');
        document.body.style.setProperty('--mouse-y', e.clientY + 'px');
    });
    
    // Close settings when clicking outside
    document.addEventListener('click', function(e) {
        const panel = document.getElementById('settingsPanel');
        const btn = document.querySelector('.settings-btn');
        if (!panel.contains(e.target) && !btn.contains(e.target)) {
            panel.classList.remove('active');
        }
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        document.getElementById('search').focus();
    }
    if (e.key === 'Escape') {
        document.getElementById('settingsPanel').classList.remove('active');
    }
});