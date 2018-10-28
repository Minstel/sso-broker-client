'use strict'

const xhr = require('xhr');
const queryString = require('query-string');

module.exports = xhrRequest;

/**
 * Perform request through xhr object
 */
function xhrRequest(logger) {
    /**
     * Process request
     * @param  {object}   options
     * @param  {Function} callback
     */
    this.process = function(options, callback) {
        this.normalizeOptions(options);

        options.withCredentials = true;

        logger.log('Perform request with options:');
        logger.log(options);

        xhr(options, callback);
    }

    /**
     * Normalize options keys and values
     * @param  {object} options
     */
    this.normalizeOptions = function(options) {
        if (typeof options.form !== 'undefined') {
            options.body = queryString.stringify(options.form);
            delete options.form;
        }

        if (!options.url.match(/^[a-z]+:\/\//)) {
            options.url = 'http://' + options.url;
        }
    }
}
