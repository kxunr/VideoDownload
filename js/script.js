/**
 * TikTok Video Downloader
 * JavaScript functionality
 * Version: 1.0.0
 */

// Global variables
let selectedQuality = 'hd';
let isProcessing = false;

// DOM elements
const elements = {
    urlInput: null,
    downloadBtn: null,
    loading: null,
    result: null,
    preview: null,
    qualityBtns: null
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    bindEvents();
    initializeAnimations();
});

/**
 * Initialize DOM elements
 */
function initializeElements() {
    elements.urlInput = document.getElementById('urlInput');
    elements.downloadBtn = document.getElementById('downloadBtn');
    elements.loading = document.getElementById('loading');
    elements.result = document.getElementById('result');
    elements.preview = document.getElementById('preview');
    elements.qualityBtns = document.querySelectorAll('.quality-btn');
    
    // Check if all elements exist
    if (!elements.urlInput || !elements.downloadBtn) {
        console.error('Required DOM elements not found');
        return;
    }
}

/**
 * Bind event listeners
 */
function bindEvents() {
    // Quality selector buttons
    elements.qualityBtns.forEach(btn => {
        btn.addEventListener('click', handleQualitySelection);
    });

    // Download button
    elements.downloadBtn.addEventListener('click', handleDownload);

    // Enter key support for input
    elements.urlInput.addEventListener('keypress', handleKeyPress);
    
    // Input validation on typing
    elements.urlInput.addEventListener('input', handleInputChange);
    
    // Prevent form submission
    elements.urlInput.addEventListener('keydown', preventFormSubmission);
    
    // Add focus animations
    elements.urlInput.addEventListener('focus', handleInputFocus);
    elements.urlInput.addEventListener('blur', handleInputBlur);
}

/**
 * Initialize animations and effects
 */
function initializeAnimations() {
    // Add stagger animation to feature cards
    const features = document.querySelectorAll('.feature');
    features.forEach((feature, index) => {
        feature.style.animationDelay = `${index * 0.1}s`;
        feature.classList.add('animate-in');
    });
    
    // Add parallax effect to container
    addParallaxEffect();
}

/**
 * Handle quality button selection
 */
function handleQualitySelection(event) {
    const btn = event.currentTarget;
    
    // Remove active class from all buttons
    elements.qualityBtns.forEach(b => {
        b.classList.remove('active');
        b.style.transform = '';
    });
    
    // Add active class to clicked button
    btn.classList.add('active');
    selectedQuality = btn.dataset.quality;
    
    // Add click animation
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        btn.style.transform = '';
    }, 150);
    
    // Update button text with animation
    updateQualityDisplay(selectedQuality);
    
    // Vibrate on mobile devices
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

/**
 * Update quality display with animation
 */
function updateQualityDisplay(quality) {
    const qualityTexts = {
        'fhd': '🎬 Full HD Selected',
        'hd': '📱 HD Selected',
        'sd': '📺 SD Selected',
        'mp3': '🎵 Audio Only Selected'
    };
    
    // Show temporary feedback
    showTemporaryMessage(qualityTexts[quality], 'info', 1500);
}

/**
 * Handle download button click
 */
async function handleDownload() {
    if (isProcessing) return;
    
    const url = elements.urlInput.value.trim();
    
    // Validation
    if (!url) {
        showResult('⚠️ TikTok URL ကို ထည့်ပါ!', 'error');
        focusInput();
        return;
    }
    
    if (!isValidTikTokUrl(url)) {
        showResult('❌ မှန်ကန်သော TikTok URL ကို ထည့်ပါ!', 'error');
        focusInput();
        return;
    }
    
    // Start processing
    isProcessing = true;
    showLoading(true);
    hideResult();
    hidePreview();
    
    try {
        // Simulate processing with realistic timing
        await processDownload(url, selectedQuality);
    } catch (error) {
        console.error('Download error:', error);
        showResult('💥 Download လုပ်ရာတွင် ပြဿနာ ဖြစ်ပွားခဲ့ပါတယ်။ ထပ်ကြိုးစားကြည့်ပါ။', 'error');
    } finally {
        isProcessing = false;
        showLoading(false);
    }
}

/**
 * Handle keyboard input
 */
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        handleDownload();
    }
}

/**
 * Handle input changes
 */
function handleInputChange(event) {
    const url = event.target.value.trim();
    
    // Real-time validation
    if (url && !isValidTikTokUrl(url)) {
        elements.urlInput.style.borderColor = '#ff6b6b';
        elements.urlInput.style.boxShadow = '0 0 10px rgba(255, 107, 107, 0.3)';
    } else {
        elements.urlInput.style.borderColor = '';
        elements.urlInput.style.boxShadow = '';
    }
    
    // Update download button state
    updateDownloadButton(url);
}

/**
 * Prevent form submission
 */
function preventFormSubmission(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
    }
}

/**
 * Handle input focus
 */
function handleInputFocus() {
    elements.urlInput.parentElement.classList.add('focused');
}

/**
 * Handle input blur
 */
function handleInputBlur() {
    elements.urlInput.parentElement.classList.remove('focused');
}

/**
 * Validate TikTok URL
 */
function isValidTikTokUrl(url) {
    const patterns = [
        /^https?:\/\/(?:www\.)?tiktok\.com\/@[\w.-]+\/video\/\d+/,
        /^https?:\/\/(?:vm|vt)\.tiktok\.com\/[\w]+/,
        /^https?:\/\/(?:www\.)?tiktok\.com\/t\/[\w]+/,
        /^https?:\/\/(?:m\.)?tiktok\.com\/v\/\d+/
    ];
    
    return patterns.some(pattern => pattern.test(url));
}

/**
 * Update download button appearance
 */
function updateDownloadButton(url) {
    const btn = elements.downloadBtn;
    
    if (!url) {
        btn.style.opacity = '0.7';
        btn.style.cursor = 'not-allowed';
    } else if (isValidTikTokUrl(url)) {
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
        btn.classList.add('ready');
    } else {
        btn.style.opacity = '0.8';
        btn.style.cursor = 'pointer';
    }
}

/**
 * Show loading state
 */
function showLoading(show) {
    const btn = elements.downloadBtn;
    
    if (show) {
        elements.loading.style.display = 'block';
        btn.disabled = true;
        btn.textContent = '⏳ Processing...';
        btn.style.opacity = '0.7';
        
        // Add processing animation
        btn.classList.add('processing');
    } else {
        elements.loading.style.display = 'none';
        btn.disabled = false;
        btn.textContent = '⬇️ Download လုပ်ရန်';
        btn.style.opacity = '1';
        
        // Remove processing animation
        btn.classList.remove('processing');
    }
}

/**
 * Show result message
 */
function showResult(message, type) {
    const result = elements.result;
    result.className = `result ${type}`;
    result.innerHTML = message;
    result.style.display = 'block';
    
    // Add entrance animation
    result.style.opacity = '0';
    result.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        result.style.transition = 'all 0.5s ease';
        result.style.opacity = '1';
        result.style.transform = 'translateY(0)';
    }, 10);
    
    // Auto hide after delay (except for errors)
    if (type !== 'error') {
        setTimeout(() => {
            hideResult();
        }, 5000);
    }
}

/**
 * Hide result message
 */
function hideResult() {
    if (elements.result) {
        elements.result.style.display = 'none';
    }
}

/**
 * Show temporary message
 */
function showTemporaryMessage(message, type, duration = 2000) {
    const tempMsg = document.createElement('div');
    tempMsg.className = `result ${type}`;
    tempMsg.textContent = message;
    tempMsg.style.position = 'fixed';
    tempMsg.style.top = '20px';
    tempMsg.style.right = '20px';
    tempMsg.style.zIndex = '9999';
    tempMsg.style.opacity = '0';
    tempMsg.style.transform = 'translateX(100px)';
    tempMsg.style.transition = 'all 0.3s ease';
    
    document.body.appendChild(tempMsg);
    
    setTimeout(() => {
        tempMsg.style.opacity = '1';
        tempMsg.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        tempMsg.style.opacity = '0';
        tempMsg.style.transform = 'translateX(100px)';
        setTimeout(() => {
            document.body.removeChild(tempMsg);
        }, 300);
    }, duration);
}

/**
 * Process download (simulation)
 */
async function processDownload(url, quality) {
    // Simulate API processing steps
    const steps = [
        { message: '🔍 URL ကို စစ်ဆေးနေပါတယ်...', delay: 800 },
        { message: '📱 Video information ရယူနေပါတယ်...', delay: 1000 },
        { message: '🎬 Video ကို process လုပ်နေပါတယ်...', delay: 1200 },
        { message: '🚫 Watermark ဖယ်ရှားနေပါတယ်...', delay: 900 },
        { message: '⬇️ Download link ပြင်ဆင်နေပါတယ်...', delay: 600 }
    ];
    
    for (const step of steps) {
        updateLoadingMessage(step.message);
        await delay(step.delay);
    }
    
    // Show final result
    await generatePreview(url, quality);
}

/**
 * Update loading message
 */
function updateLoadingMessage(message) {
    const loadingText = elements.loading.querySelector('p');
    if (loadingText) {
        loadingText.textContent = message;
    }
}

/**
 * Generate preview
 */
async function generatePreview(url, quality) {
    const qualityInfo = getQualityInfo(quality);
    const videoInfo = generateVideoInfo(url);
    
    const preview = elements.preview;
    preview.innerHTML = `
        <img src="${generateThumbnail()}" alt="TikTok Video" onerror="this.src='data:image/svg+xml;base64,${getPlaceholderImage()}'">
        <div class="preview-info">
            <h3>🎬 ${videoInfo.title}</h3>
            <p><strong>👤 Creator:</strong> ${videoInfo.author}</p>
            <p><strong>📊 Quality:</strong> ${qualityInfo.name}</p>
            <p><strong>📏 Resolution:</strong> ${qualityInfo.resolution}</p>
            <p><strong>📦 File Size:</strong> ${qualityInfo.size}</p>
            <p><strong>⏱️ Duration:</strong> ${videoInfo.duration}</p>
            <p><strong>✅ Status:</strong> <span style="color: #4CAF50;">Ready to download</span></p>
            <div class="download-links">
                <a href="#" class="download-link" onclick="downloadFile('${quality}', event)">
                    📥 Download ${qualityInfo.name}
                </a>
                ${quality !== 'mp3' ? `
