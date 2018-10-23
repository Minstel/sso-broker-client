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
        name = escapeForRegExp(name);

        const cookies = ';' + this.window.document.cookie;        
        const separator = new RegExp(';\\s*' + name + '=');
        const parts = cookies.split(separator);

        return parts.length > 1 ? 
            parts[1].substring(0, parts[1].indexOf(';')) :
            null;
    }

    /**
     * Set token cookie
     */
    this.setCookie = function() {
        const now = (new Date()).getTime();
        const expires = (new Date()).setTime(now + this.cookieLifetime);

        this.window.document.cookie = this.cookieName + '=' + this.token + ';path=/;expires=' + expires;
    }   

    /**
     * Clear cookie value
     */
    this.clearCookie = function() {
        const now = (new Date()).getTime();
        const expires = (new Date()).setTime(now - 1000);

        this.window.document.cookie = this.cookieName + '=;path=/;expires=' + expires;
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