'use strict'

module.exports = Logger;

/**
 * Perform debug loggin
 * @param {boolean} debug
 */
function Logger(debug) {
    this.debug = !!debug;

    /**
     * Perform debug logging
     * @param  {mixed} message
     */
    this.log = function(message) {
        if (this.debug) console.log(message);
    }
}
