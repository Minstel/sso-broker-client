'use strict';

/**
 * Unit tests for SSOBroker auth trait
 */

const Broker = require('../');

describe('SSO Broker: auth trait', function () {
    it('should perform login', function() {
        const broker = new Broker({document: {}}, 'foo', 'bar', 'zoo');
        const testData = null; 

        broker.sendPOSTRequest = function(url, params) {
            return new Promise((resolve, reject) => {
                testData = {
                    test_url: url,
                    test_params: params
                };

                resolve(testData);
            });
        };

        const result = broker.login('some_username', 'some_password');

        expect(broker.userInfo).toEqual(testData);
        expect(result instanceof Promise).toBe(true);
        result.then(response => expect(response).toEqual(testData));
    });

    it('should perform logout', function() {
        const broker = new Broker({document: {}}, 'foo_url', 'bar', 'zoo');

        broker.sendPOSTRequest = function(url, params) {
            return {
                test_url: url,
                test_params: params
            };

            return testData;
        };

        const result = broker.logout();

        expect(result).toEqual({
            test_url: 'foo_url',
            test_params: {command: 'logout'}
        });
    });
});
