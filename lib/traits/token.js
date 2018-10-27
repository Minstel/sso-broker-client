'use strict'

const md5 = require('md5');
const uniqueId = require('uniqid');
const baseConvert = require('baseconvert');
const Random = require('random-js');

module.exports = tokenTrait;

/**
 * Broker methods for working with token
 */
function tokenTrait() {
    /**
     * Generate token
     * @return {string}
     */
    this.createToken = function() {
        this.log('Create token');

        var random = new Random(Random.engines.mt19937().autoSeed());
        random = random.integer(1, 100);

        const base = md5(uniqueId(random));
        const token = baseConvert.converter(base).fromBase(16).toBase(32);

        return token;
    }

    /**
     * Clear token and cookie value
     */
    this.clearToken = function() {
        this.log('Clear token');

        this.token = null;
        this.clearCookie();
    }
}
