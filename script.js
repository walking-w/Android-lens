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

// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://your-backend-api.com',
    ENDPOINTS: {
        DEVICE_INFO: '/api/device/info',
        // Add other endpoints as needed
    },
    HEADERS: {
        'Content-Type': 'application/json',
        // Add authorization headers if needed
    }
};

// Device Data Structure with default loading state
let deviceData = {
    // Device Details
    name: "Loading...",
    manufacturer: "Loading...",
    model: "Loading...",
    isRooted: false,
    imei: "Loading...",
    mdi: "Loading...",
    serialNumber: "Loading...",
    androidVersion: "Loading...",
    securityPatchLevel: "Loading...",
    
    // Others
    seizedDate: "Loading...",
    phoneNumber: "Loading...",
    storageSize: "Loading...",
    complianceStatus: "Loading...",
    // Add more fields as needed
};

// Field configuration for proper display
const fieldConfig = {
    /* Device Details */
    name: { label: "Device Name", section: "device", icon: "fa-mobile" },
    manufacturer: { label: "Manufacturer", section: "device", icon: "fa-industry" },
    model: { label: "Model", section: "device", icon: "fa-tag" },
    isRooted: { 
        label: "Root Status", 
        section: "device",
        icon: "fa-shield-alt",
        format: (value) => value ? "Rooted" : "Not Rooted",
        class: (value) => value ? "red" : "green"
    },
    imei: { label: "IMEI", section: "device", icon: "fa-barcode" },
    serialNumber: { label: "Serial Number", section: "device", icon: "fa-hashtag" },
    androidVersion: { label: "Android Version", section: "device", icon: "fa-android" },
    securityPatchLevel: { 
        label: "Security Patch", 
        section: "device",
        icon: "fa-lock",
        class: (value) => isPatchCurrent(value) ? "green" : "red"
    },
    
    /* Other Information */
    seizedDate: { 
        label: "Seized Date", 
        section: "other",
        icon: "fa-calendar-alt",
        format: (value) => formatDate(value)
    },
    phoneNumber: { label: "Phone Number", section: "other", icon: "fa-phone" },
    storageSize: { 
        label: "Storage", 
        section: "other",
        icon: "fa-hdd",
        format: (value) => `${value} GB`
    },
    complianceStatus: { 
        label: "Compliance", 
        section: "other",
        icon: "fa-check-circle",
        class: (value) => value === "Compliant" ? "green" : "red"
    },
    lastBackup: {
        label: "Last Backup",
        section: "other",
        icon: "fa-cloud",
        format: (value) => value ? formatDate(value) : "Never"
    }
};
// Helper functions
function formatDate(dateString) {
    if (!dateString || dateString === "Loading...") return dateString;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function isPatchCurrent(patchDate) {
    if (!patchDate || patchDate === "Loading...") return false;
    const patch = new Date(patchDate);
    const current = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(current.getMonth() - 6);
    return patch >= sixMonthsAgo;
}

// API Service
async function fetchDeviceData() {
    try {
        showToast('Fetching device data...', 'info');
        
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DEVICE_INFO}`, {
            method: 'GET',
            headers: API_CONFIG.HEADERS
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        showToast('Device data loaded successfully', 'success');
        return data;
    } catch (error) {
        console.error('Error fetching device data:', error);
        showToast('Failed to load device data', 'error');
        return null;
    }
}


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
    // Add smooth transition
    body.classList.add('theme-transition');
    
    // Toggle between dark and light mode classes
    body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode');
    
    // Update toggle state
    const isDarkMode = body.classList.contains('dark-mode');
    darkModeToggle.classList.toggle('inactive', !isDarkMode);
    darkModeToggle.classList.toggle('active', isDarkMode);
    
    // Update icon and localStorage
    const toggleIcon = darkModeToggle.querySelector('i') || createToggleIcon();
    updateToggleIcon(toggleIcon, isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Show toast notification
    showToast(`${isDarkMode ? 'Dark' : 'Light'} mode enabled`, 'info');
    
    // Remove transition class after animation
    setTimeout(() => {
        body.classList.remove('theme-transition');
    }, 300);
}

function createToggleIcon() {
    const icon = document.createElement('i');
    icon.className = 'fas fa-moon';
    darkModeToggle.appendChild(icon);
    return icon;
}

function updateToggleIcon(icon, isDarkMode) {
    icon.classList.toggle('fa-moon', isDarkMode);
    icon.classList.toggle('fa-sun', !isDarkMode);
}

function loadDarkModePreference() {
    // Default to dark mode if no preference exists
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const isDarkMode = savedTheme === 'dark';
    
    // Set initial classes
    body.classList.toggle('dark-mode', isDarkMode);
    body.classList.toggle('light-mode', !isDarkMode);
    
    // Initialize toggle state
    const toggleIcon = darkModeToggle.querySelector('i') || createToggleIcon();
    darkModeToggle.classList.toggle('inactive', !isDarkMode);
    darkModeToggle.classList.toggle('active', isDarkMode);
    updateToggleIcon(toggleIcon, isDarkMode);
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
    const navHeaders = document.querySelectorAll('.nav-header');
    const allTextElements = document.querySelectorAll('.nav-item span, .logo-text span, .toggle-label, .collapse-menu span');

    if (!isCollapsed) {
        // Collapse the sidebar
        sidebar.classList.remove('sidebar-expanded');
        sidebar.classList.add('sidebar-collapsed');
        sidebar.style.width = '60px';
        
        // Hide all text elements
        allTextElements.forEach(text => text.style.display = 'none');
        navHeaders.forEach(header => header.style.display = 'none');
        
        // Rotate collapse icon
        collapseIcon.classList.remove('fa-chevron-left');
        collapseIcon.classList.add('fa-chevron-right');
        
        // Center align items
        document.querySelector('.logo').style.justifyContent = 'center';
        document.querySelector('.toggle-container').style.justifyContent = 'center';
        document.querySelector('.toggle-container').style.padding = '0';
    } else {
        // Expand the sidebar
        sidebar.classList.remove('sidebar-collapsed');
        sidebar.classList.add('sidebar-expanded');
        sidebar.style.width = '220px';
        
        // Show all text elements
        allTextElements.forEach(text => text.style.display = '');
        navHeaders.forEach(header => header.style.display = '');
        
        // Rotate collapse icon back
        collapseIcon.classList.remove('fa-chevron-right');
        collapseIcon.classList.add('fa-chevron-left');
        
        // Reset alignments
        document.querySelector('.logo').style.justifyContent = '';
        document.querySelector('.toggle-container').style.justifyContent = '';
        document.querySelector('.toggle-container').style.padding = '';
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
function populateDeviceInfo(data = null) {
    if (data) {
        deviceData = {
            /* Device Details */
            name: data.deviceName || "Unknown",
            manufacturer: data.manufacturer || "Unknown",
            model: data.model || "Unknown",
            isRooted: data.rootStatus || false,
            imei: data.imeiNumber || "Unknown",
            serialNumber: data.serial || "Unknown",
            androidVersion: data.androidVersion || "Unknown",
            securityPatchLevel: data.securityPatch || "Unknown",
            
            /* Other Information */
            seizedDate: data.seizedDate || new Date().toISOString(),
            phoneNumber: data.phoneNumber || "Unknown",
            storageSize: data.totalStorage || 0,
            complianceStatus: data.complianceStatus || "Unknown",
            lastBackup: data.lastBackup || null
        };
    }

    const containers = {
        device: document.getElementById('device-details-container'),
        other: document.getElementById('other-details-container')
    };
    
    // Clear existing content
    Object.values(containers).forEach(container => container.innerHTML = '');
    
    // Create and append detail items
    Object.entries(fieldConfig).forEach(([key, config]) => {
        const value = deviceData[key];
        const container = containers[config.section];
        
        const detailItem = document.createElement('div');
        detailItem.className = 'detail-item';
        
        const icon = document.createElement('i');
        icon.className = `fas ${config.icon || 'fa-info-circle'} detail-icon`;
        
        const detailLabel = document.createElement('div');
        detailLabel.className = 'detail-label';
        detailLabel.textContent = config.label;
        
        const detailValue = document.createElement('div');
        detailValue.className = 'detail-value';
        detailValue.textContent = config.format ? config.format(value) : value;
        
        if (config.class) {
            const className = typeof config.class === 'function' 
                ? config.class(value) 
                : config.class;
            detailValue.classList.add(className);
        }
        
        detailItem.appendChild(icon);
        detailItem.appendChild(detailLabel);
        detailItem.appendChild(detailValue);
        
        // Copy functionality
        detailItem.addEventListener('click', () => {
            navigator.clipboard.writeText(detailValue.textContent)
                .then(() => showToast(`${config.label} copied`, 'success'))
                .catch(() => showToast('Failed to copy', 'error'));
        });
        
        container.appendChild(detailItem);
    });
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
            // copyBtn.setAttribute('data-tooltip', 'Copy to clipboard');
            
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

// Initialize the application
async function initializeApp() {
    initializeUI();
    
    // Show loading state
    populateDeviceInfo();
    
    // Fetch real device data from API
    const apiData = await fetchDeviceData();
    if (apiData) {
        populateDeviceInfo(apiData);
    }
    
    enhanceDeviceDetails();
    initEventListeners();
    
    // Optional: Set up periodic refresh
    setInterval(async () => {
        const freshData = await fetchDeviceData();
        if (freshData) {
            populateDeviceInfo(freshData);
        }
    }, 300000); // Refresh every 5 minutes
}

// Start the application
document.addEventListener('DOMContentLoaded', initializeApp);

// // Main initialization
// document.addEventListener('DOMContentLoaded', () => {
//     initializeUI();
//     populateDeviceInfo();
//     enhanceDeviceDetails(); // Add this new function call
//     initEventListeners();
//     showToast('Welcome to Android Lens', 'success');
// });
