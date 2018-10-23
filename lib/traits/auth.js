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
        const params = {
            command: 'login',
            username: username,
            password: password
        };

        return this.sendPOSTRequest(this.url, params)
            .then(response => this.userinfo = response);
    }    

    /**
     * Logout
     * @return {Promise} 
     */
    this.logout = function() {
        return this.sendPOSTRequest(this.url, {
            command: 'logout'
        });
    }
}
