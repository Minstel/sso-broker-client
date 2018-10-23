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
        const broker = new Broker({document: {}}, 'foo', 'some_broker_id', 'zoo');
        const result = broker.createSessionId();

        expect(result).toBe(null);
    });
});
