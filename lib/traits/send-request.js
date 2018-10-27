'use strict'

const extend = require('extend');
const queryString = require('query-string');
const HttpWrapper = require('../http-wrapper');

module.exports = sendRequestTrait;

/**
 * Broker methods for sending requests
 */
function sendRequestTrait() {
    /**
     * Send GET request
     * @param  {string}   url
     * @param  {object}   params   Query params
     * @return {Promise}
     */
    this.sendGETRequest = function(url, params) {
        this.log('Send GET request');

        const request = new HttpWrapper(this.logger);
        url = url + '?' + queryString.stringify(params);

        return this.sendRequest(request, {
            method: 'GET',
            url: url
        });
    }
    /**
     * Send POST request
     * @param  {string}   url
     * @param  {object}   params   Query params
     * @return {Promise}
     */
    this.sendPOSTRequest = function(url, params) {
        this.log('Send POST request');

        const request = new HttpWrapper(this.logger);

        //Place 'command' param in query parameters, because in preflight OPTIONS requet post params are not send.
        //So we'll get 404 Not Found, if 'command' is in POST
        if (typeof params.command !== 'undefined') {
            url = url + '?' + queryString.stringify({command: params.command});
            delete params.command;
        }

        return this.sendRequest(request, {
            method: 'POST',
            url: url,
            form: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    }

    /**
     * Generic function for sending request
     * @param {object}  request     Request lib instance. Passed as parameter for easy testing
     * @param {object}  options
     * @return {Promise}
     */
    this.sendRequest = function(request, options) {
        const self = this;

        return new Promise((resolve, reject) => {
            extend(true, options, {
                headers: {
                    'Accept': 'application/json',
                    'Cookie': self.window.document.cookie,
                    'Authorization': 'Bearer ' + this.createSessionId()
                }
            });

            request.process(options, (error, response, body) => {
                if (response && response.statusCode == 403) {
                    this.clearToken();
                    reject('Session was not attached to server session. ' + error);
                }

                if (error) {
                    reject('Error while performing request: ' + error);
                }

                if (body) {
                    const isJson = typeof response.headers['content-type'] !== 'undefined' &&
                        response.headers['content-type'].indexOf('application/json') !== -1;

                    if (!isJson) {
                        reject('Error while performing request: Expected application/json response, got ' + response.headers['content-type']);
                    }

                    self.log('Obtained response body:');
                    self.log(body);

                    body = JSON.parse(body);
                }

                resolve(body);
            });
        })
    }
}
