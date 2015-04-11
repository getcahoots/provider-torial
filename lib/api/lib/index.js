/*
 * cahoots-provider-torial-api
 *
 * Copyright Cahoots.pw
 * MIT Licensed
 *
 */

/**
 * @author André König <andre@cahoots.ninja>
 *
 */

'use strict';

var mandatory = require('mandatory');

const resources = {
    users: require('./users')
};

module.exports = function instantiate (resourceName) {
    var resource = resources[resourceName];

    mandatory(resource).is('function', 'Please provide a proper resource name');

    return resource();
};
