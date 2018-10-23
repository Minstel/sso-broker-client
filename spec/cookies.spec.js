'use strict';

/**
 * Unit tests for SSOBroker cookies methods
 */

const extend = require('extend');
const Broker = require('../');

describe('SSO Broker: cookies trait', function () {    
    it('should correctly create cookie name', function() {
        const broker = new Broker({document: {}}, 'foo', 'some: Broker___id__', 'zoo');
        const result = broker.createCookieName();

        expect(result).toEqual('sso_token_some_broker_id_');
    });

    function getCookieProvider() {
        return [
            {note: 'get empty cookie from empty cookies string', cookie: '', expected: null},
            {note: 'get empty cookie if it is not set', cookie: 'foo_cook=bar', expected: null},
            {note: 'get cookie if it is set in first place', cookie: 'tes!t_c;+oo?kie=some_value;path=/; foo_cook=bar', expected: 'some_value'},
            {note: 'get cookie if it is set not in first place', cookie: 'zoo_cook=test;tes!t_c;+oo?kie=some_value;path=/; foo_cook=bar', expected: 'some_value'},
            {note: 'get cookie if it is set not in first place with space before', cookie: 'zoo_cook=test; tes!t_c;+oo?kie=some_value;path=/; foo_cook=bar', expected: 'some_value'},
            {note: 'get cookie if it has empty value', cookie: 'zoo_cook=test; tes!t_c;+oo?kie=;path=/; foo_cook=bar', expected: ''},
        ]
    }

    getCookieProvider().forEach(function(spec) {
        it(spec.note, function() {
            const broker = new Broker({document: {cookie: spec.cookie}}, 'foo', 'bar', 'zoo');
            const result = broker.getCookie('tes!t_c;+oo?kie');

            expect(result).toEqual(spec.expected);
        });
    });

    it('should correctly set cookie value', function() {
        const broker = new Broker({document: {}}, 'foo', 'some_broker_id', 'zoo');

        broker.setCookie('test_token');
        const result = broker.window.document.cookie;

        expect(result).toMatch(/^sso_token_some_broker_id=test_token;path=\/;expires=\w{3}, \d{2} \w{3} \d{4} \d{2}:\d{2}:\d{2} GMT/);

        var date = result.match(/expires=(.*)$/);
        date = new Date(date[1]);

        expect(date > new Date()).toBe(true);
    });

    it('should correctly clear cookie value', function() {
        const cookie = 'sso_token_some_broker_id=test_token;path=/;expires=Wed, 24 Oct 2018 12:10:14 GMT';
        const broker = new Broker({document: {}}, 'foo', 'some_broker_id', 'zoo');        
        broker.window.document.cookie = cookie;

        broker.clearCookie();
        const result = broker.window.document.cookie;

        expect(result).toMatch(/^sso_token_some_broker_id=;path=\/;expires=\w{3}, \d{2} \w{3} \d{4} \d{2}:\d{2}:\d{2} GMT/);

        var date = result.match(/expires=(.*)$/);
        date = new Date(date[1]);

        expect(date < new Date()).toBe(true);
    });

    it('should init cookie name and token value on instance creation', function() {
        const cookie = 'sso_token_some_broker_id=test_token;path=/;expires=Wed, 24 Oct 2018 12:10:14 GMT';
        const broker = new Broker({document: {cookie: cookie}}, 'foo', 'some_broker_id', 'zoo');        

        expect(broker.cookieName).toEqual('sso_token_some_broker_id');
        expect(broker.token).toEqual('test_token');        
    });
});
