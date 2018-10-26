'use strict'

const url = require('url');
const http = require('http');
const https = require('https');
const queryString = require('query-string');

module.exports = HttpWrapper;

function HttpWrapper() {
    /**
     * Process request
     * @param  {object} options
     * @param  {function} callback
     */
    this.process = function(options, callback) {
        if (!options.url) {
            throw '"url" property should be specified for request';
        }

        this.expandUrl(options);
        const postData = this.detachPostData(options);
        const requestLib = this.chooseHttpLib(options);

        this.send(requestLib, options, postData, callback);
    }

    /**
     * Perform request
     * @param  {object} requestLib
     * @param  {object} options
     * @param  {object} postData
     * @param  {function} callback
     */
    this.send = function(requestLib, options, postData, callback) {
        const request = requestLib.request(options, response => {
            var body = null;

            response.setEncoding('utf8');
            response.on('data', chunk => {
                body += chunk;
            });

            response.on('end', () => {
                callback(null, response, body);
            });
        });

        request.on('error', error => {
            callback(error, null, null);
        });

        postData && request.write(postData);
        request.end();
    }

    /**
     * Merge url parts into options
     * @param  {object} options
     */
    this.expandUrl = function(options) {
        if (!options.url.match(/^[a-z]+:\/\//)) {
            options.url = 'http://' + options.url;
        }

        const urlParts = url.parse(options.url);
        const fields = ['protocol', 'auth', 'hostname', 'port', 'path'];

        for (var i = 0; i < fields.length; i++) {
            var value = urlParts[fields[i]];

            if (typeof value !== 'undefined' && value) {
                options[fields[i]] = value;
            }
        }

        delete options.url;
    }

    /**
     * Extract post data from options
     * @param  {object} options
     * @return {object}          Post data
     */
    this.detachPostData = function(options) {
        const postData = typeof options.form !== 'undefined' ? options.form : null;
        delete options.form;

        return postData;
    }

    /**
     * Choose request lib to use (http or https)
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    this.chooseHttpLib = function(options) {
        const useHttp = typeof options.protocol === 'undefined' || options.protocol == 'http:';

        return useHttp ? http : https;
    }
}
