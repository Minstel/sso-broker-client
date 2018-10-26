'use strict';

/**
 * Unit tests for http wrapper class
 */

const http = require('http');
const https = require('https');
const HttpWrapper = require('../lib/http-wrapper');

describe('Http wrapper', function () {
    var request = null;

    beforeEach(function() {
        request = new HttpWrapper();
    });

    function expandUrlProvider() {
        return [
            {
                note: 'should expand url having only host',
                url: 'www.foo.com',
                expected: {
                    foo: 'bar',
                    hostname: 'www.foo.com',
                    protocol: 'http:',
                    path: '/'
                }
            },
            {
                note: 'should expand full url',
                url: 'http://user:password@www.foo.com/some/path?zoo=baz',
                expected: {
                    foo: 'bar',
                    auth: 'user:password',
                    hostname: 'www.foo.com',
                    protocol: 'http:',
                    path: '/some/path?zoo=baz'
                }
            },
            {
                note: 'should expand full url with https',
                url: 'https://user:password@www.foo.com/some/path?zoo=baz',
                expected: {
                    foo: 'bar',
                    auth: 'user:password',
                    hostname: 'www.foo.com',
                    protocol: 'https:',
                    path: '/some/path?zoo=baz'
                }
            },
        ];
    }

    expandUrlProvider().forEach(function(spec) {
        it(spec.note, function() {
            const options = {
                url: spec.url,
                foo: 'bar'
            };

            request.expandUrl(options);

            expect(options).toEqual(spec.expected);
        })
    });

    function detachPostDataProvider() {
        return [
            {note: 'should detach post data', options: {foo: 'bar', form: {field: 'value'}}, expectedPostData: {field: 'value'}, expectedOptions: {foo: 'bar'}},
            {note: 'should not fail on empty post data', options: {foo: 'bar'}, expectedPostData: null, expectedOptions: {foo: 'bar'}}
        ];
    }

    detachPostDataProvider().forEach(function(spec) {
        it(spec.note, function() {
            const postData = request.detachPostData(spec.options);

            expect(postData).toEqual(spec.expectedPostData);
            expect(spec.options).toEqual(spec.expectedOptions);
        });
    });

    function chooseHttpLibProvider() {
        return [
            {note: 'Should choose http by default', options: {foo: 'bar'}, expected: http},
            {note: 'Should choose http', options: {foo: 'bar', protocol: 'http:'}, expected: http},
            {note: 'Should choose https', options: {foo: 'bar', protocol: 'https:'}, expected: https},
        ];
    }

    chooseHttpLibProvider().forEach(function(spec) {
        it(spec.note, function() {
            const lib = request.chooseHttpLib(spec.options);

            expect(lib).toEqual(spec.expected);
        });
    });
});
