'use strict';

/**
 * Unit tests for SSOBroker send-request trait
 */

const request = require('request');
const Broker = require('../');

describe('SSO Broker: send-request trait', function () {
    it('should preform GET request', function() {
        const broker = new Broker({document: {}}, 'foo', 'bar', 'zoo');

        broker.sendRequest = function(requestObj, options) {
            return { requestObj, options };
        };

        const params = {'param1': 'val1', 'param2': 'val 2'};
        const result = broker.sendGETRequest('some_url', params);

        expect(result).toEqual({
            requestObj: request,
            options: {
                method: 'GET',
                url: 'some_url?param1=val1&param2=val%202'
            }
        });
    });

    it('should perform POST request', function() {
        const broker = new Broker({document: {}}, 'foo', 'bar', 'zoo');

        broker.sendRequest = function(requestObj, options) {
            return { requestObj, options };
        };

        const params = {'param1': 'val1', 'param2': 'val 2'};
        const result = broker.sendPOSTRequest('some_url', params);

        expect(result).toEqual({
            requestObj: request,
            options: {
                method: 'POST',
                url: 'some_url',
                form: params
            }
        });
    });

    it('should produce an error if session was not attached to server session', function(callback) {
        const broker = new Broker({document: {}}, 'foo', 'bar', 'zoo');

        const testOptions = getOptions();
        const passOptions = testOptions['passOptions'];
        const allOptions = testOptions['allOptions'];

        const requestMock = function(options, callback) {
            expect(options).toEqual(allOptions);

            callback('Some error message from server', {statusCode: 403}, null);
        };

        broker.token = 'some_token';
        broker.createSessionId = function() {
            return 'foo_session_id';
        }

        const result = broker.sendRequest(requestMock, passOptions);

        expect(broker.token).toBe(null);
        expect(result instanceof Promise).toBe(true);

        result.catch(error => {
            expect(error).toBe('Session was not attached to server session. Some error message from server');
            callback();
        });
    });

    it('should produce an error if server returned arbitrary error', function(callback) {
        const broker = new Broker({document: {}}, 'foo', 'bar', 'zoo');

        const testOptions = getOptions();
        const passOptions = testOptions['passOptions'];
        const allOptions = testOptions['allOptions'];

        const requestMock = function(options, callback) {
            expect(options).toEqual(allOptions);

            callback('Some error message from server', {statusCode: 500}, null);
        };

        broker.token = 'some_token';
        broker.createSessionId = function() {
            return 'foo_session_id';
        }

        const result = broker.sendRequest(requestMock, passOptions);

        expect(broker.token).toBe('some_token');
        expect(result instanceof Promise).toBe(true);

        result.catch(error => {
            expect(error).toBe('Error while performing request: Some error message from server');
            callback();
        });
    });

    it('should produce an error if server returned not json', function(callback) {
        const broker = new Broker({document: {}}, 'foo', 'bar', 'zoo');

        const testOptions = getOptions();
        const passOptions = testOptions['passOptions'];
        const allOptions = testOptions['allOptions'];

        const requestMock = function(options, callback) {
            const headers = {'content-type': 'plain/html'};

            expect(options).toEqual(allOptions);
            callback(null, { headers }, 'some_non_json_body');
        };

        broker.token = 'some_token';
        broker.createSessionId = function() {
            return 'foo_session_id';
        }

        const result = broker.sendRequest(requestMock, passOptions);

        expect(broker.token).toBe('some_token');
        expect(result instanceof Promise).toBe(true);

        result.catch(error => {
            expect(error).toBe('Error while performing request: Expected application/json response, got plain/html');
            callback();
        });
    });

    it('should return parsed json body', function(callback) {
        const broker = new Broker({document: {}}, 'foo', 'bar', 'zoo');

        const testOptions = getOptions();
        const passOptions = testOptions['passOptions'];
        const allOptions = testOptions['allOptions'];

        const requestMock = function(options, callback) {
            const headers = {'content-type': 'application/json'};

            expect(options).toEqual(allOptions);
            callback(null, { headers }, '{"foo": "bar"}');
        };

        broker.token = 'some_token';
        broker.createSessionId = function() {
            return 'foo_session_id';
        }

        const result = broker.sendRequest(requestMock, passOptions);

        expect(broker.token).toBe('some_token');
        expect(result instanceof Promise).toBe(true);

        result.then(response => {
            expect(response).toEqual({foo: 'bar'});
            callback();
        });
    });

    /**
     * Get test request options
     * @return {object}
     */
    function getOptions() {
        const passOptions = {
            method: 'POST',
            url: 'some_url'
        };

        const allOptions = {
            method: 'POST',
            url: 'some_url',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer foo_session_id'
            }
        };

        return { passOptions, allOptions };
    }
});
