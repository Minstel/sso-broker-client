'use strict';

/**
 * Unit tests for SSOBroker session-id trait
 */

const Broker = require('../');

describe('SSO Broker: session-id trait', function() {
    it('should create session id', function() {
        const broker = new Broker({document: {}}, 'foo', 'some_broker_id', 'zoo');

        broker.token = 'test_token';
        broker.createChecksum = function(prefix) {
            return 'some_checksum';
        };

        const result = broker.createSessionId();

        expect(result).toEqual('SSO-some_broker_id-test_token-some_checksum');
    });

    it('should not create session id if token is not set', function() {
        const broker = new Broker({document: {}}, 'foo', 'bar', 'zoo');
        const result = broker.createSessionId();

        expect(result).toBe(null);
    });

    it('should create checksum', function() {
        const broker = new Broker({document: {}}, 'foo', 'bar', 'zoo');
        broker.token = 'test_token';

        const result1 = broker.createChecksum('some_prefix');
        const result2 = broker.createChecksum('some_prefix');

        expect(result1).toMatch(/[a-z0-9]{64}/i);
        expect(result2).toMatch(/[a-z0-9]{64}/i);
        expect(result1).toEqual(result2);
    });

    it('should not create checksum if token is not set', function() {
        const broker = new Broker({document: {}}, 'foo', 'bar', 'zoo');
        const result = broker.createChecksum();

        expect(result).toBe(null); 
    });
});
