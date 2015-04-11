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

var debug = require('debug')('cahoots:provider:torial');
var mandatory = require('mandatory');
var VError = require('verror');

var storage = require('cahoots-provider-torial-storage');
var sync = require('cahoots-provider-torial-sync');

const AVAILABLE_ENTITIES = ['person', 'organization'];

debug('about to initialize the sync module ...');
sync(storage);

module.exports = function initialize (name) {
    if (!~AVAILABLE_ENTITIES.indexOf(name)) {
        throw new VError('failed to return the torial entity "%s". It does not exist. Available entities are: %j', name, AVAILABLE_ENTITIES);
    }

    let entity = new Entity(name);

    return {
        query: entity.query.bind(entity)
    };
};

function Entity (name) {
    this.$name = name;
    this.$dao = storage(name);
}

Entity.prototype.query = function query (q, callback) {
    var self = this;

    mandatory(q).is('object', 'Please provide a proper query object');
    mandatory(callback).is('function', 'Please provide a proper callback function');

    function onQuery (err, results) {
        if (err) {
            debug('failed to execute query "%j" on the "%s" entity', q, self.$name);
            return callback(new VError(err, 'failed to execute query "%j" on the "%s" entity', q, self.$name));
        }

        debug('queried the "%s" dao successfully (%d result(s))', self.$name, results.length);

        callback(null, results);
    }

    debug('about to query the "%s" dao', this.$name);

    this.$dao.query(q, onQuery);
};
