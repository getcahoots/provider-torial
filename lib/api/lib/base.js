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

const ENDPOINT = 'http://torialmock.cahoots.pw';

module.exports = BaseResource;

function BaseResource () {}

BaseResource.prototype.$prepareURI = function $prepareURI (action) {
    if (action[0] !== '/') {
        action = '/' + action;
    }

    return ENDPOINT + action;
};
