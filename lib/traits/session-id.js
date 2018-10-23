'use strict'

const sha256 = require('js-sha256').sha256;

module.exports = sessionIdTrait;

/**
 * Broker methods for working with session id
 */
function sessionIdTrait() {       
    /**
     * Generate session id
     * @return {string}
     */
    this.createSessionId = function() {
        if (!this.token) return null;

        const checksum = this.createChecksum('session');

        return `SSO-${this.brokerId}-${this.token}-${this.checksum}`;
    };
    
    /**
     * Create token-broker checksum
     * @return {string}
     */
    this.createChecksum = function(prefix) {
        if (!this.token) return null;

        return sha256(prefix + this.token + this.secret);
    }
}