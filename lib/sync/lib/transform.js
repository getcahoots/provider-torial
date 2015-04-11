/*
 * cahoots-provider-torial-sync
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

const PROVIDER_NAME = 'torial';

function extractCahoot (entry) {
    var cahoot = {};

    cahoot.organization = {};
    cahoot.organization.name = entry.name;
    cahoot.organization.info = entry.url;

    cahoot.provider = PROVIDER_NAME;
    cahoot.verified = true;

    return cahoot;
}

/**
 * Transformation function which converts the torial user object
 * data structure into the Cahoots person / organization data structure.
 *
 * @param {object} user
 * The user object from torial
 *
 * @returns {object} person
 * The Cahoots person / organization data structure.
 *
 */
module.exports = function transform (user) {
    var person = {};

    person.name = user.firstname + ' ' + user.lastname;
    person.info = user.profile_url;

    person.cahoots = [];

    [
        user.memberships,
        user.supports,
        user.participations
    ].forEach(function onEach (connections) {
        connections.forEach(function onEach (connection) {
            var cahoot = extractCahoot(connection);

            cahoot.source = user.disclosure_url;

            person.cahoots.push(cahoot);
        });
    });

    return person;
};
