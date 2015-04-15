/*
 * cahoots-provider-torial
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

const ENDPOINT = process.env.CAHOOTS_PROVIDER_TORIAL_API_ENDPOINT;

module.exports = BaseResource;

function BaseResource () {}

BaseResource.prototype.$prepareURI = function $prepareURI (action) {
    if (action[0] !== '/') {
        action = '/' + action;
    }

    return ENDPOINT + action;
};
