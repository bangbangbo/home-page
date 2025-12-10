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

// Background themes
function changeBg(theme) {
    document.body.className = theme;
    localStorage.setItem('bgTheme', theme);
    
    document.querySelectorAll('.bg-option').forEach(opt => {
        opt.classList.remove('active');
    });
    document.querySelector(`[data-bg="${theme}"]`).classList.add('active');
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

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Load saved theme
    const savedTheme = localStorage.getItem('bgTheme') || 'cyber';
    changeBg(savedTheme);
    
    // Start time
    updateTime();
    setInterval(updateTime, 1000);
    
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