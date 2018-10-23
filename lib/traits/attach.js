'use strict'

module.exports = attachTrait;

/**
 * Broker methods for working with attach url
 */
function attachTrait() {       
    /**
     * Check if session is attached to general server session
     * @return {Boolean}
     */
    this.isAttached = function() {
        return !!this.token;
    };

    /**
     * Attach current user session to common server session
     * @param {string|boolean} returnToUrl
     * @param {object} params  Additional params to send with request
     * @return {Promise}
     */
    this.attach = function(returnToUrl, params, callback) {
        if (this.isAttached()) return;

        this.token = this.createToken();  
        this.setCookie(this.token);

        if (typeof params === 'undefined') params = {};
        if (returnToUrl === true) returnToUrl = this.window.location.href;

        extend(params, {
            command: 'attach',
            return_url: returnToUrl,
            broker: this.brokerId,
            token: this.token,
            checksum: this.createChecksum('attach')
        });

        return this.sendGETRequest(this.url, params, callback);
    }
}
