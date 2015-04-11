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

var debug = require('debug')('cahoots:provider:torial:sync');
var mandatory = require('mandatory');
var pluck = require('lodash.pluck');
var series = require('async-light').series;
var torial = require('./api');
var VError = require('verror');

var transform = require('./transform');

const DEFAULT_INTERVAL = (60 * 1000) * 60 * 24;

module.exports = function instantiate (buckets, interval) {
    mandatory(buckets).is('function', 'Please pass the storage buckets');

    let sync = new TorialSync(buckets, interval || DEFAULT_INTERVAL);

    sync.run();
};

function TorialSync (buckets, interval) {
    this.$buckets = buckets;
    this.$worker = setInterval(this.run.bind(this), interval);
}

/**
 * @private
 *
 * Fetches a particular user object from Torial
 *
 * @param {number} id
 * The id of the user which should be fetched
 *
 * @param {function} callback
 * Will be invoked when the respective user has been fetched as `callback(err, user)`
 *
 */
TorialSync.prototype.$fetchUser = function $fetchUser (id, callback) {
    var users = torial('users');

    function onFind (err, user) {
        if (err) {
            return callback(new VError(err, 'failed to receive the user with the id "%d" from torial', id));
        }

        debug('fetched the user with the id "%d" from torial', id);
        callback(null, user);
    }

    debug('fetching the user with the id "%d"', id);
    users.findById(id, onFind);
};

/**
 * @private
 *
 * Fetches all available users from Torial
 *
 * @param {function} callback
 * Will be invoked when all user objects has been fetched as `callback(err, users)`.
 *
 */
TorialSync.prototype.$fetchUsers = function $fetchUsers (callback) {
    var self = this;
    var users = torial('users');

    function onList (err, ids) {
        if (err) {
            return callback(new VError(err, 'failed to receive the list with all users from torial'));
        }

        debug('fetched a list with all user id\'s from torial');

        let tasks = pluck(ids, 'id').map(function onMap (id) {
            return function fetchUserWrapper (callback) {
                self.$fetchUser(id, callback);
            };
        });

        debug('fetching now each user object individually');

        series(tasks, onDone);
    }

    function onDone (err, results) {
        if (err) {
            return callback(new VError(err, 'failed to receive all user objects from torial'));
        }

        debug('fetched all users from torial');

        callback(null, results);
    }

    debug('fetching a list with all user id\'s from torial');

    users.list(onList);
};

TorialSync.prototype.$storeOrganizations = function $storeOrganizations (persons, callback) {
    var cahoots = [];

    function onDone (err) {
        if (err) {
            return callback(err);
        }

        callback(null, persons);
    }

    persons.forEach(function onEach (person) {
        cahoots.push.apply(cahoots, person.cahoots);
    });

    let tasks = [];
    let organizationBucket = this.$buckets('organization');

    cahoots.forEach(function onEach (cahoot) {
        tasks.push(function convert (done) {
            function onInsert (err, organization) {
                if (err) {
                    return done(new VError(err, 'failed to insert the organization'));
                }

                cahoot.organization = organization.id;

                done(null);
            }

            organizationBucket.insert(cahoot.organization, onInsert);
        });
    });

    series(tasks, onDone);
};

TorialSync.prototype.$storePersons = function $storePersons (persons, callback) {
    var tasks = [];

    function onDone (err) {
        if (err) {
            return callback(err);
        }

        callback(null, persons);
    }

    let personBucket = this.$buckets('person');

    persons.forEach(function onEach (person) {
        tasks.push(function store (done) {
            function onInsert (err) {
                if (err) {
                    return done(new VError(err, 'failed to insert the person'));
                }

                done(null);
            }

            personBucket.insert(person, onInsert);
        });
    });

    series(tasks, onDone);
};

TorialSync.prototype.run = function run () {
    var self = this;
    var persons = [];

    function onFetch (err, users) {
        if (err) {
            return debug('[ERROR] failed to fetch all users from torial: %s', err.message);
        }

        debug('-> 1. fetched all users.');

        debug('2. transforming users to cahoots data structure');

        users.forEach(function onEach (user) {
            persons.push(transform(user));
        });

        debug('-> 2. transformed to cahoots data structure');

        debug('3. wipe the storage');

        self.$buckets.destroy(onDestroy);
    }

    function onDestroy (err) {
        if (err) {
            return debug('[ERROR] failed to clean the database before inserting the fresh data: %s', err.message);
        }

        debug('-> 3. wiped the storage');

        debug('4. store all `organizations` of the persons and replace the object with the id');

        self.$storeOrganizations(persons, onStoreOrganizations);
    }

    function onStoreOrganizations (err) {
        if (err) {
            return debug('[ERROR] failed to store all organizations of the persons: %s', err.message);
        }

        debug('-> 4. stored all organizations');

        debug('5. store all persons');

        self.$storePersons(persons, onStorePersons);
    }

    function onStorePersons (err, persons) {
        if (err) {
            return debug('[ERROR] failed to store all persons: %s', err.message);
        }

        debug('-> 5. stored all persons');

        debug('sync process finished successfully (synced %d person(s))', persons.length);
    }

    debug('about to start the sync process.');
    debug('1. fetching all users');

    this.$fetchUsers(onFetch);
};

