'use strict'

const extend = require('extend');

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
     * @param {object} params  Additional params to send with request
     * @return {null|Promise}
     */
    this.attach = function(params, callback) {
        if (this.isAttached()) {
            this.log('-- Already attached');
            return null;
        }

        this.log('-- Attach');

        this.token = this.createToken();
        this.setCookie(this.token);

        if (typeof params === 'undefined') params = {};

        extend(params, {
            command: 'attach',
            broker: this.brokerId,
            token: this.token,
            checksum: this.createChecksum('attach')
        });

        const self = this;

        return this.sendGETRequest(this.url, params, callback)
            .catch(error => {
                self.log('!- Cleanup on error');
                self.clearToken();

                throw error;
            });
    }
}
