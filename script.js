// DOM Elements
const body = document.body;
const sidebar = document.querySelector('.sidebar');
const logoText = document.querySelector('.logo-text');
const navTexts = document.querySelectorAll('.nav-item span');
const toggleLabel = document.querySelector('.toggle-label');
const collapseText = document.querySelector('.collapse-menu span');
const collapseMenuBtn = document.querySelector('.collapse-menu');
const collapseIcon = document.querySelector('.collapse-menu i');
const darkModeToggle = document.querySelector('.toggle');
const navItems = document.querySelectorAll('.nav-item');
const rebootBtn = document.querySelector('.device-btn.reboot');
const shutdownBtn = document.querySelector('.device-btn.shutdown');
const arriveBtn = document.querySelector('.device-btn.arrive');
const exportBtn = document.querySelector('.export-btn');
const searchInput = document.querySelector('.search-container input');

// Device data object
const deviceData = {
    name: "Advancit TV",
    make: "Laptop & Computer",
    model: "Samsung Galaxy S24 Ultra G⁹",
    rootStatus: false,
    imei: "354721882436351",
    mdi: "Apple Inc.",
    serialNumber: "A123456789ABCDEF",
    androidVersion: "14.0.1",
    securityPatchLevel: "Latest",
    seized: "January 01, 2018",
    phoneNumber: "June 01, 2018",
    size: "16GB",
    status: "Compliant"
};

// Check if we're on a mobile device
function isMobile() {
    return window.innerWidth <= 768;
}

// Initialize the UI based on device
function initializeUI() {
    if (isMobile()) {
        toggleSidebar(true);
    }
    loadDarkModePreference();
}

// Toggle dark mode & light mode
function toggleDarkMode() {
    function toggleDarkMode() {
        // Create transition effect by adding class first
        body.classList.add('theme-transition');
        
        // Toggle dark mode class
        body.classList.toggle('dark-mode');
        darkModeToggle.classList.toggle('active');
        
        // Update toggle state visually
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            darkModeToggle.classList.remove('inactive');
            darkModeToggle.classList.add('active');
            
            // Update toggle icon if you have one
            const toggleIcon = darkModeToggle.querySelector('i') || document.createElement('span');
            if (toggleIcon.classList.contains('fa-sun')) {
                toggleIcon.classList.remove('fa-sun');
                toggleIcon.classList.add('fa-moon');
            }
            
            showToast('Dark mode enabled', 'info');
        } else {
            localStorage.setItem('theme', 'light');
            darkModeToggle.classList.remove('active');
            darkModeToggle.classList.add('inactive');
            
            // Update toggle icon if you have one
            const toggleIcon = darkModeToggle.querySelector('i') || document.createElement('span');
            if (toggleIcon.classList.contains('fa-moon')) {
                toggleIcon.classList.remove('fa-moon');
                toggleIcon.classList.add('fa-sun');
            }
            
            showToast('Light mode enabled', 'info');
        }
        
        // Remove transition class after animation completes
        setTimeout(() => {
            body.classList.remove('theme-transition');
        }, 300);
    }
}
// Load dark mode preference
function loadDarkModePreference() {
    const savedTheme = localStorage.getItem('theme');
    
    // Make sure toggle has an icon
    let toggleIcon = darkModeToggle.querySelector('i');
    if (!toggleIcon) {
        toggleIcon = document.createElement('i');
        toggleIcon.className = 'fas';
        darkModeToggle.appendChild(toggleIcon);
    }
    
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        darkModeToggle.classList.remove('inactive');
        darkModeToggle.classList.add('active');
        toggleIcon.classList.remove('fa-sun');
        toggleIcon.classList.add('fa-moon');
    } else {
        body.classList.remove('dark-mode');
        darkModeToggle.classList.remove('active');
        darkModeToggle.classList.add('inactive');
        toggleIcon.classList.remove('fa-moon');
        toggleIcon.classList.add('fa-sun');
    }
}
function setupThemeShortcut() {
    document.addEventListener('keydown', (e) => {
        // Toggle theme with Alt+T (or Option+T on Mac)
        if (e.altKey && e.key === 't') {
            toggleDarkMode();
        }
    });
}

// Function to show toast notifications
function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    
    toast.innerHTML = `<i class="fas fa-${icon}"></i>${message}`;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Toggle sidebar collapse/expand with alignment fix
function toggleSidebar(forceCollapse = false) {
    const isCollapsed = sidebar.classList.contains('sidebar-collapsed') || forceCollapse;

    if (!isCollapsed) {
        sidebar.classList.remove('sidebar-expanded');
        sidebar.classList.add('sidebar-collapsed');
        logoText.style.display = 'none';
        navTexts.forEach(text => text.style.display = 'none');
        toggleLabel.style.display = 'none';
        collapseText.style.display = 'none';
        collapseIcon.classList.remove('fa-chevron-left');
        collapseIcon.classList.add('fa-chevron-right');
        sidebar.style.width = '60px';
        
        // Fix for toggle button and its container
        darkModeToggle.style.margin = '0 auto';
        document.querySelector('.toggle-container').style.justifyContent = 'center';
        document.querySelector('.toggle-container').style.padding = '0';
        
        // Fix for logo
        document.querySelector('.logo').style.justifyContent = 'center';
        document.querySelector('.logo').style.padding = '0 10px';
    } else {
        sidebar.classList.remove('sidebar-collapsed');
        sidebar.classList.add('sidebar-expanded');
        logoText.style.display = 'flex';
        navTexts.forEach(text => text.style.display = 'inline');
        toggleLabel.style.display = 'inline';
        collapseText.style.display = 'inline';
        collapseIcon.classList.remove('fa-chevron-right');
        collapseIcon.classList.add('fa-chevron-left');
        sidebar.style.width = '250px';
        
        // Reset toggle button styling
        darkModeToggle.style.margin = '';
        document.querySelector('.toggle-container').style.justifyContent = '';
        document.querySelector('.toggle-container').style.padding = '';
        
        // Reset logo styling
        document.querySelector('.logo').style.justifyContent = '';
        document.querySelector('.logo').style.padding = '';
    }
}

// Export device data as JSON
function exportDeviceData() {
    const dataStr = JSON.stringify(deviceData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'android-lens-device-data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showToast('Device data exported successfully', 'success');
}

// Search functionality
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    if (searchTerm.length > 0) {
        showToast(`Searching for: "${searchTerm}"`, 'info');
        highlightMatches(searchTerm);
    } else {
        resetHighlighting();
    }
}

// Highlight search matches
function highlightMatches(term) {
    resetHighlighting();
    const detailValues = document.querySelectorAll('.detail-value');
    
    detailValues.forEach(element => {
        const text = element.textContent.toLowerCase();
        if (text.includes(term)) {
            element.style.backgroundColor = 'rgba(255, 101, 0, 0.2)';
            element.style.padding = '2px 5px';
            element.style.borderRadius = '4px';
        }
    });
}

// Reset search highlighting
function resetHighlighting() {
    const detailValues = document.querySelectorAll('.detail-value');
    detailValues.forEach(element => {
        element.style.backgroundColor = '';
        element.style.padding = '';
        element.style.borderRadius = '';
    });
}

// Device action functions
function rebootDevice() {
    showToast('Rebooting device...', 'info');
    setTimeout(() => showToast('Device rebooted successfully', 'success'), 2000);
}

function shutdownDevice() {
    showToast('Shutting down device...', 'info');
    setTimeout(() => showToast('Device shut down successfully', 'success'), 2000);
}

function arriveDevice() {
    showToast('Processing arrive command...', 'info');
    setTimeout(() => showToast('Device arrived successfully', 'success'), 2000);
}

// Navigation item selection
function handleNavigation() {
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const pageName = item.querySelector('span').textContent.trim();
            showToast(`Navigating to ${pageName}`, 'info');
            if (isMobile()) toggleSidebar(true);
        });
    });
}

// Populate device info
function populateDeviceInfo() {
    const detailsContainer = document.querySelector('.device-details');
    for (const [key, value] of Object.entries(deviceData)) {
        const detailRow = document.createElement('div');
        detailRow.className = 'detail-row';

        const detailLabel = document.createElement('div');
        detailLabel.className = 'detail-label';
        detailLabel.textContent = formatLabel(key);

        const detailValue = document.createElement('div');
        detailValue.className = 'detail-value';
        detailValue.textContent = value;

        detailRow.appendChild(detailLabel);
        detailRow.appendChild(detailValue);
        detailsContainer.appendChild(detailRow);
    }
}

// Format labels
function formatLabel(key) {
    return key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase()).trim();
}




// Add interactive features to device details
function enhanceDeviceDetails() {
    const detailRows = document.querySelectorAll('.detail-row');
    
    detailRows.forEach(row => {
        // Make rows interactive
        row.addEventListener('mouseenter', () => {
            row.classList.add('highlight-row');
        });
        
        row.addEventListener('mouseleave', () => {
            row.classList.remove('highlight-row');
        });
        
        // Add copy functionality
        const detailValue = row.querySelector('.detail-value');
        if (detailValue) {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
            copyBtn.setAttribute('data-tooltip', 'Copy to clipboard');
            
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(detailValue.textContent)
                    .then(() => {
                        showToast('Copied to clipboard!', 'success', 1500);
                    })
                    .catch(() => {
                        showToast('Failed to copy', 'error');
                    });
            });
            
            row.appendChild(copyBtn);
        }
    });
}

// Modify initEventListeners to include new functionality
function initEventListeners() {
    collapseMenuBtn.addEventListener('click', () => toggleSidebar());
    darkModeToggle.addEventListener('click', toggleDarkMode);
    rebootBtn.addEventListener('click', rebootDevice);
    shutdownBtn.addEventListener('click', shutdownDevice);
    arriveBtn.addEventListener('click', arriveDevice);
    exportBtn.addEventListener('click', exportDeviceData);
    searchInput.addEventListener('input', handleSearch);
    
    // Add keyboard shortcut
    setupThemeShortcut();
    
    // Add tooltip hover events if you have tooltips
    setupTooltips();
    
    // Add responsive behavior
    window.addEventListener('resize', () => {
        if (isMobile() && !sidebar.classList.contains('sidebar-collapsed')) toggleSidebar(true);
    });
    
    handleNavigation();
}

// Add tooltip functionality
function setupTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltipText = e.target.getAttribute('data-tooltip');
            
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            
            document.body.appendChild(tooltip);
            
            const rect = e.target.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            
            tooltip.style.top = `${rect.top - tooltipRect.height - 10}px`;
            tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltipRect.width / 2)}px`;
            
            setTimeout(() => tooltip.classList.add('show'), 10);
        });
        
        element.addEventListener('mouseleave', () => {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.classList.remove('show');
                setTimeout(() => tooltip.remove(), 300);
            }
        });
    });
}

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeUI();
    populateDeviceInfo();
    enhanceDeviceDetails(); // Add this new function call
    initEventListeners();
    showToast('Welcome to Android Lens', 'success');
});