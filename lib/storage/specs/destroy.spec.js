/*
 * cahoots-provider-torial-storage
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

require('./tools');

var util = require('util');

var storage = require('../');

var expect = require('expect.js');

describe('The storage layer should provide a destroy method', function suite () {

    before(storage.destroy);

    it('that is capable to clean a database', function test (done) {
        var andre = {
            token: Date.now()
        };

        function onSave (err) {
            expect(err).to.be(null);

            storage('person').query({}, onQuery);
        }

        function onQuery (err, persons) {
            expect(err).to.be(null);

            expect(util.isArray(persons)).to.be(true);
            expect(persons.length).to.be(1);

            storage.destroy(onDestroy);
        }

        function onDestroy (err) {
            expect(err).to.be(null);

            storage('person').query({}, onEmpty);
        }

        function onEmpty (err, persons) {
            expect(err).to.be(null);

            expect(util.isArray(persons)).to.be(true);
            expect(persons.length).to.be(0);

            storage('person').insert(andre, onInsert);
        }

        function onInsert (err) {
            expect(err).to.be(null);

            storage('person').query({}, onFinalQuery);
        }

        function onFinalQuery (err, persons) {
            expect(err).to.be(null);

            expect(util.isArray(persons)).to.be(true);
            expect(persons.length).to.be(1);

            done();
        }

        storage('person').insert(andre, onSave);
    });
});
