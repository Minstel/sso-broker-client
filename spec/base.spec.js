'use strict';

/**
 * Unit tests for SSOBroker
 */

const extend = require('extend');
const Broker = require('../');

describe('SSO Broker', function () {
    it('should use methods from trait', function() {
        const source = {
            getFullNameTest: function(name) {
                return 'John ' + name;
            },
            getUrlTest: function() {
                return this.url;
            }
        };

        const broker = new Broker({document: {}}, 'foo', 'bar', 'zoo');

        broker.useTrait(source);

        expect(broker.getFullNameTest('Doe')).toEqual('John Doe');
        expect(broker.getUrlTest()).toEqual('foo');
    });

    function initExceptionProvider() {
        return [
            {
                note: 'should throw if window object is not set',
                window: null,
                url: 'bar',
                brokerId: 'baz',
                secret: 'zoo',
                expected: 'Window object is not specified'
            },
            {
                note: 'should throw if url is not set',
                window: 'foo',
                url: null,
                brokerId: 'baz',
                secret: 'zoo',
                expected: 'SSO server URL not specified'
            },
            {
                note: 'should throw if broker id is not set',
                window: 'foo',
                url: 'bar',
                brokerId: null,
                secret: 'zoo',
                expected: 'SSO broker id not specified'
            },
            {
                note: 'should throw if secret is not set',
                window: 'foo',
                url: 'bar',
                brokerId: 'baz',
                secret: null,
                expected: 'SSO broker secret not specified'
            },
        ];
    }

    initExceptionProvider().forEach(function(spec) {
        it(spec.note, function() {
            try {
                const broker = new Broker(spec.window, spec.url, spec.brokerId, spec.secret);
            } catch (e) {
                expect(e).toEqual(spec.expected);
            }
        })
    });

    it('should get userinfo from property, without performing request', function(callback) {
        const broker = new Broker({document: {}}, 'foo', 'bar', 'zoo');

        broker.userInfo = 'test';
        broker.sendGETRequest = function() {
            throw 'Request is performed';
        }

        const result = broker.getUserInfo();

        expect(result instanceof Promise).toBe(true);

        result.then(userInfo => {
            expect(userInfo).toEqual('test');
            callback();
        });
    });

    it('should perform request to get userinfo if it is not set as property', function() {
        const broker = new Broker({document: {}}, 'foo_url', 'bar', 'zoo');
        broker.sendRequest = function(requestObj, options) {
            return extend(options, {'test': true});
        };

        const result = broker.getUserInfo();

        expect(result).toEqual({
            method: 'GET',
            url: 'foo_url?command=userInfo',
            test: true
        });
    });

    it('should append host to url, if it starts with slash', function() {
        const broker1 = new Broker({location: {hostname: 'www.foo.com'}, document: {}}, 'foo_url', 'bar', 'zoo');
        const broker2 = new Broker({location: {hostname: 'www.foo.com'}, document: {}}, '/foo_url', 'bar', 'zoo');

        expect(broker1.url).toBe('foo_url');
        expect(broker2.url).toBe('www.foo.com/foo_url');
    })
});
