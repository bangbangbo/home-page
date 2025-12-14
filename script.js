let currentEngine = 'google';
let user = 'vemacitrind';
const API_KEY = 'YOUR_API_KEY';
const city = 'Delhi';
const searchEngines = {
    google: 'https://www.google.com/search?q=',
    duckduckgo: 'https://duckduckgo.com/?q=',
    bing: 'https://www.bing.com/search?q='
};

// Search functionality
document.getElementById('search').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const query = this.value.trim();
        if (query) {
            window.open(
                searchEngines[currentEngine] + encodeURIComponent(query),
                "_blank"
            );
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
}

// Settings panel
function toggleSettings() {
    const panel = document.getElementById('settingsPanel');
    panel.classList.toggle('active');
}

// Theme toggle functionality
let isDarkTheme = true;
let particlesEnabled = true;

function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.querySelector('#themeButton span');

    if (isDarkTheme) {
        body.classList.remove('darktheme');
        body.classList.add('lighttheme');
        themeIcon.className = 'fas fa-moon';
        themeText.textContent = 'Light Theme';
    } else {
        body.classList.remove('lighttheme');
        body.classList.add('darktheme');
        themeIcon.className = 'fas fa-sun';
        themeText.textContent = 'Dark Theme';
    }

    isDarkTheme = !isDarkTheme;
    localStorage.setItem('isDarkTheme', isDarkTheme);
}

function toggleParticles() {
    const particleIcon = document.getElementById('particleIcon');
    const particleText = document.querySelector('#particleButton span');

    particlesEnabled = !particlesEnabled;

    if (particlesEnabled) {
        particleIcon.className = 'fas fa-sparkles';
        particleText.textContent = 'Particles On';
        if (window.particlesJS) {
            document.getElementById('particles-js')?.remove();
            const canvas = document.createElement('div');
            canvas.id = 'particles-js';
            document.body.appendChild(canvas);
        }
    } else {
        particleIcon.className = 'fas fa-ban';
        particleText.textContent = 'Particles Off';
        document.getElementById('particles-js')?.remove();
    }

    localStorage.setItem('particlesEnabled', particlesEnabled);
}

function setAccentColor(color) {
    document.documentElement.style.setProperty('--primary', color);
    document.documentElement.style.setProperty('--primary-dark', color + 'dd');

    document.querySelectorAll('.color-option').forEach(opt => {
        opt.classList.remove('active');
    });
    document.querySelector(`[data-color="${color}"]`).classList.add('active');

    localStorage.setItem('accentColor', color);
}

// Set preset image
function setCustomImage(imagePath) {
    const currentTheme = isDarkTheme ? 'darktheme' : 'lighttheme';
    document.body.style.backgroundImage = `var(--imgcol), url("${imagePath}")`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.className = `${currentTheme} withImageBackground`;
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
        reader.onload = function (e) {
            const imageUrl = e.target.result;
            const currentTheme = isDarkTheme ? 'darktheme' : 'lighttheme';
            document.body.style.backgroundImage = `var(--imgcol), url("${imageUrl}")`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundRepeat = 'no-repeat';
            document.body.className = `${currentTheme} withImageBackground`;
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
        hour12: true,
        hour: 'numeric',
        minute: '2-digit'
    });
    document.getElementById('time').textContent = timeStr;
}

// Date display
function updateDate() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
    document.getElementById('date').textContent = dateStr;
}

// Greeting based on time
function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();
    let greeting;

    if (hour < 12) {
        greeting = 'Good morning';
    } else if (hour < 17) {
        greeting = 'Good afternoon';
    } else {
        greeting = 'Good evening';
    }

    document.getElementById('greetings').textContent = `${greeting}, <span class="master">${vemacitrind}</span>`;
}

// Weather API
async function updateWeather() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
        document.getElementById('description').textContent = data.weather[0].description;
    } catch (error) {
        console.log('Weather API error:', error);
        // Keep default values if API fails
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    // Load saved theme
    const savedBgTheme = localStorage.getItem('bgTheme');

    if (savedBgTheme === 'custom') {
        const customBg = localStorage.getItem('customBg');
        if (customBg) {
            const currentTheme = isDarkTheme ? 'darktheme' : 'lighttheme';
            document.body.style.backgroundImage = `var(--imgcol), url("${customBg}")`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundRepeat = 'no-repeat';
            document.body.className = `${currentTheme} withImageBackground`;
        }
    } else if (savedBgTheme === 'preset') {
        const presetImage = localStorage.getItem('presetImage');
        if (presetImage) {
            setCustomImage(presetImage);
        }
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('isDarkTheme');
    if (savedTheme !== null) {
        isDarkTheme = savedTheme === 'true';
        if (!isDarkTheme) {
            toggleTheme();
        }
    }

    // Load saved particle setting
    const savedParticles = localStorage.getItem('particlesEnabled');
    if (savedParticles !== null) {
        particlesEnabled = savedParticles === 'true';
        if (!particlesEnabled) {
            toggleParticles();
        }
    }

    // Load saved accent color
    const savedColor = localStorage.getItem('accentColor');
    if (savedColor) {
        setAccentColor(savedColor);
    }

    // Start timers
    updateTime();
    updateDate();
    updateGreeting();
    updateWeather();
    setInterval(updateTime, 1000);
    setInterval(updateDate, 60000);
    setInterval(updateGreeting, 60000);
    setInterval(updateWeather, 300000); // Update weather every 5 minutes

    // Custom cursor tracking
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateCursor() {
        document.body.style.setProperty('--mouse-x', mouseX + 'px');
        document.body.style.setProperty('--mouse-y', mouseY + 'px');
        requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Close settings when clicking outside
    document.addEventListener('click', function (e) {
        const panel = document.getElementById('settingsPanel');
        const btn = document.querySelector('.settings-btn');
        if (!panel.contains(e.target) && !btn.contains(e.target)) {
            panel.classList.remove('active');
        }
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        document.getElementById('search').focus();
    }
    if (e.key === 'Escape') {
        document.getElementById('settingsPanel').classList.remove('active');
    }
});