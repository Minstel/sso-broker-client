'use strict'

const extend = require('extend');
const request = require('request');
const queryString = require('query-string');

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
        return this.sendRequest(request, {
            method: 'POST',
            url: url,
            form: params
        });
    }

    /**
     * Generic function for sending request
     * @param {object}  request     Request lib instance. Passed as parameter for easy testing
     * @param {object}  options
     * @return {Promise}
     */
    this.sendRequest = function(request, options) {
        return new Promise((resolve, reject) => {
            extend(options, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + this.createSessionId()
                }
            });

            request(options, (error, response, body) => {
                if (response.statusCode == 403) {
                    this.clearToken();
                    reject('Session was not attached to server session. ' + error);
                }

                if (error) {
                    reject('Error while performing request: ' + error);
                }

                if (body) {
                    if (response.headers['content-type'] !== 'application/json') {
                        reject('Error while performing request: Expected application/json response, got ' + response.headers['content-type']);
                    }

                    body = JSON.parse(body);
                }

                resolve(body);
            });
        })
    }
}
