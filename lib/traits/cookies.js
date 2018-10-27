'use strict'

module.exports = cookieTrait;

/**
 * Broker methods for working with cookies
 */
function cookieTrait() {
    /**
     * Build name for token cookie
     * @return {string}
     */
    this.createCookieName = function() {
        return 'sso_token_' + this.brokerId.toLowerCase().replace(/[_\W]+/g, '_');
    };

    /**
     * Get cookie value by name
     * @param  {string} cookies All cookies
     * @param  {string} name
     * @return {string}
     */
    this.getCookie = function(name) {
        this.log('Get cookie ' + name);

        name = escapeForRegExp(name);

        const cookies = ';' + this.window.document.cookie;
        const separator = new RegExp(';\\s*' + name + '=');
        const parts = cookies.split(separator);

        var value = null;
        if (parts.length > 1) {
            value = parts[1];

            const toPos = value.indexOf(';');
            if (toPos !== -1) {
                value = value.substring(0, toPos);
            }
        }

        this.log('Obtained cookie: ' + value);

        return value;
    }

    /**
     * Set token cookie
     */
    this.setCookie = function(token) {
        const now = (new Date()).getTime();
        const expires = (new Date());
        expires.setTime(now + this.cookieLifetime);

        const value = this.cookieName + '=' + token + ';path=/;expires=' + expires.toUTCString();

        this.log('Set cookie: ' + value);
        this.window.document.cookie = value;
    }

    /**
     * Clear cookie value
     */
    this.clearCookie = function() {
        const now = (new Date()).getTime();
        const expires = (new Date());
        expires.setTime(now - 1000);

        const value = this.cookieName + '=;path=/;expires=' + expires.toUTCString();

        this.log('Clear cookie: ' + value);
        this.window.document.cookie = value;
    }

    /**
     * Escape special symbols in string for using in regexp
     * @param  {string} string
     * @return {string}
     */
    function escapeForRegExp(string) {
        return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
}
