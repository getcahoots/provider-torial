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

var util = require('util');

var debug = require('debug')('cahoots:provider:torial:api:users');
var mandatory = require('mandatory');
var duperagent = require('duperagent')();
var VError = require('verror');

var BaseResource = require('./base');

module.exports = function instantiate () {
    var users = new UsersResource();

    return {
        list: users.list.bind(users),
        findById: users.findById.bind(users)
    };
};

function UsersResource () {
    BaseResource.call(this);
}

util.inherits(UsersResource, BaseResource);

UsersResource.prototype.list = function list (callback) {
    let action = '/users';

    mandatory(callback).is('function', 'Please provide a proper callback function.');

    let uri = this.$prepareURI(action);

    function onResponse (err, users) {
        if (err) {
            debug('[ERROR] failed to receive all torial users');
            return callback(new VError(err, 'failed to grab all torial users.'));
        }

        debug('received list with all torial users');
        callback(null, users);
    }

    debug('request the list with all torial users');

    duperagent.get(uri, onResponse);
};

UsersResource.prototype.findById = function findById (id, callback) {
    let action = '/users/:id';

    mandatory(id).is('number', 'Please provide a proper users id.');
    mandatory(callback).is('function', 'Please provide a proper callback function.');

    let uri = this.$prepareURI(action.replace(':id', id));

    function onResponse (err, user) {
        if (err) {
            debug('[ERROR] failed to receive the torial user with the id "%d"', id);
            return callback(new VError(err, 'failed to receive the torial user with the id "%d"', id));
        }

        debug('received torial user with the id "%d"', id);

        callback(null, user);
    }

    debug('request a particular torial user with the id "%d"', id);

    duperagent.get(uri, onResponse);
};
