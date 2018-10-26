'use strict'

const AuthTrait = require('./lib/traits/auth');
const TokenTrait = require('./lib/traits/token');
const AttachTrait = require('./lib/traits/attach');
const CookieTrait = require('./lib/traits/cookies');
const SessionIdTrait = require('./lib/traits/session-id');
const SendRequestTrait = require('./lib/traits/send-request');

module.exports = SSOBroker;

function SSOBroker(window, url, brokerId, secret, cookieLifetime) {
    const self = this;

    this.window = window;
    this.url = url;
    this.brokerId = brokerId;
    this.secret = secret;
    this.cookieLifetime = cookieLifetime ? cookieLifetime * 1000 : 1000 * 3600; //1 hour default (in milliseconds)
    this.cookieName = null;
    this.token = null;
    this.userInfo = null;

    /**
     * Init broker on creation
     * @return {[type]} [description]
     */
    this.init = function() {
        if (!this.window) throw "Window object is not specified";
        if (!this.brokerId) throw "SSO broker id not specified";
        if (!this.secret) throw "SSO broker secret not specified";
        if (!this.url) throw "SSO server URL not specified";
        if (this.url.substr(0, 1) === '/') {
            this.url = this.window.location.hostname + this.url;
        }

        this.useTrait(new CookieTrait());
        this.useTrait(new TokenTrait());
        this.useTrait(new SessionIdTrait());
        this.useTrait(new AttachTrait());
        this.useTrait(new SendRequestTrait());
        this.useTrait(new AuthTrait());

        this.cookieName = this.createCookieName();
        this.token = this.getCookie(this.cookieName);
    }

    /**
     * Use methods and properties from trait (helper object)
     * @param  {object} object
     */
    this.useTrait = function(object) {
        for (var name in object) {
            this[name] = object[name];
        }
    };

    /**
     * Get user info
     * @return {Promise}
     */
    this.getUserInfo = function() {
        if (this.userInfo) {
            return new Promise((resolve, reject) => {
                resolve(self.userInfo);
            });
        }

        return this.sendGETRequest(this.url, {command: 'userInfo'});
    }

    this.init();
}
