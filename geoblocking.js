// ═══════════════════════════════════════════════════════════════════
// MODULE GÉOBLOCAGE 2025 (OPTIMISÉ VITESSE)
// ═══════════════════════════════════════════════════════════════════

class GeoBlocker {
    constructor(config) {
        this.config = config;
        this.userCountry = null;
        this.userIP = null;
        this.detectionMethod = null;
    }

    // ═══════════════════════════════════════════════════════════════
    // DÉTECTION ULTRA-RAPIDE VIA TIMEZONE (0ms)
    // ═══════════════════════════════════════════════════════════════

    async detectCountry() {
        // Toutes les APIs sont désactivées → fallback timezone immédiat
        return this.detectCountryByTimezone();
    }

    // ═══════════════════════════════════════════════════════════════
    // FALLBACK TIMEZONE (INSTANTANÉ)
    // ═══════════════════════════════════════════════════════════════

    detectCountryByTimezone() {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const timezoneMap = {
            'America/New_York': 'US',
            'America/Chicago': 'US',
            'America/Los_Angeles': 'US',
            'America/Toronto': 'CA',
            'Europe/London': 'GB',
            'Europe/Paris': 'FR',
            'Europe/Berlin': 'DE',
            'Europe/Amsterdam': 'NL',
            'Europe/Brussels': 'BE',
            'Europe/Zurich': 'CH',
            'Europe/Rome': 'IT',
            'Europe/Madrid': 'ES',
            'Australia/Sydney': 'AU'
        };

        const country = timezoneMap[timezone] || 'XX';

        if (this.config.DEBUG_MODE) {
            console.log(`[GEO] Timezone: ${timezone} → ${country}`);
        }

        this.userCountry = country;
        this.detectionMethod = 'timezone_fallback';

        return {
            ip: 'unknown',
            country: country,
            countryName: 'Unknown (timezone)',
            city: '',
            region: ''
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // VÉRIFICATION ACCÈS (ULTRA-RAPIDE)
    // ═══════════════════════════════════════════════════════════════

    async checkAccess() {
        const geoData = await this.detectCountry();

        if (!this.userCountry) {
            return {
                allowed: true,
                reason: 'geo_detection_failed',
                geoData: null
            };
        }

        const isAllowed = this.config.ALLOWED_COUNTRIES.includes(this.userCountry);

        if (this.config.DEBUG_MODE) {
            console.log(`[GEO] ${this.userCountry}: ${isAllowed ? 'ALLOWED' : 'BLOCKED'}`);
        }

        return {
            allowed: isAllowed,
            reason: isAllowed ? 'country_allowed' : 'country_blocked',
            geoData: geoData
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // VÉRIFICATION IP MICROSOFT
    // ═══════════════════════════════════════════════════════════════

    isMicrosoftIP(ip) {
        if (!ip || ip === 'unknown') return false;

        for (let range of this.config.MICROSOFT_IP_RANGES) {
            if (ip.startsWith(range)) {
                if (this.config.DEBUG_MODE) {
                    console.log(`[GEO] Microsoft IP: ${ip}`);
                }
                return true;
            }
        }

        return false;
    }

    // ═══════════════════════════════════════════════════════════════
    // INFOS GÉO
    // ═══════════════════════════════════════════════════════════════

    getGeoInfo() {
        return {
            country: this.userCountry,
            ip: this.userIP,
            method: this.detectionMethod
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeoBlocker;
}
