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

const AVAILABLE_ENTITIES = ['person', 'organization'];
const CONFIG_DB_PATH = process.env.CAHOOTS_PROVIDER_TORIAL_DATABASE_PATH;
const CONFIG_SYNC_INTERVAL = process.env.CAHOOTS_PROVIDER_TORIAL_SYNC_INTERVAL;

var bucketdb = require('bucketdb')(CONFIG_DB_PATH);
var sync = require('./sync');

sync(bucketdb, CONFIG_SYNC_INTERVAL);

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
    this.$bucket = bucketdb(name);
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

        debug('queried the "%s" bucket successfully (%d result(s))', self.$name, results.length);

        callback(null, results);
    }

    debug('about to query the "%s" bucket', this.$name);

    this.$bucket.query(q, onQuery);
};
