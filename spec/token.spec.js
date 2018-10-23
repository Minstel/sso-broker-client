'use strict';

/**
 * Unit tests for SSOBroker token trait
 */

const Broker = require('../');

describe('SSO Broker: token trait', function () {
    it('should create random token', function() {
        const broker = new Broker({document: {}}, 'foo', 'bar', 'zoo');
        const result1 = broker.createToken();
        const result2 = broker.createToken();

        expect(result1).toMatch(/[a-z0-9]{20,}/i);
        expect(result2).toMatch(/[a-z0-9]{20,}/i);
        expect(result1).not.toEqual(result2);
    });

    it('should clear existing token and call clearing cookie', function() {
        const broker = new Broker({document: {}}, 'foo', 'bar', 'zoo');
        broker.token = 'foo';

        var clearCookie = false;
        broker.clearCookie = function() {
            clearCookie = true;
        };

        broker.clearToken();

        expect(broker.token).toBe(null);
        expect(clearCookie).toBe(true);        
    });    
});
