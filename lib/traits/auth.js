'use strict'

module.exports = authTrait;

/**
 * Broker methods for login/logout
 */
function authTrait() {
    /**
     * Login
     * @param  {string} username
     * @param  {string} password
     * @return {Promise}
     */
    this.login = function(username, password) {
        this.log('-- Login');

        const params = {
            command: 'login',
            username: username,
            password: password
        };

        return this.sendPOSTRequest(this.url, params)
            .then(response => this.userInfo = response);
    }

    /**
     * Logout
     * @return {Promise}
     */
    this.logout = function() {
        this.log('-- Logout');

        return this.sendPOSTRequest(this.url, {
            command: 'logout'
        });
    }
}
