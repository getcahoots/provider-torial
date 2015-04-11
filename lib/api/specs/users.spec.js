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

var expect = require('expect.js');

var torial = require('..');

describe('The "UsersResource"', function suite () {

    this.timeout(5000);

    it('should be able to list all users', function test (done) {
        var users = torial('users');

        function onList (err, users) {
            expect(err).to.be(null);

            expect(util.isArray(users)).to.be(true);
            expect(users[0].id).not.to.be(undefined);

            done();
        }

        users.list(onList);
    });

    it('should be able to find a specific user by id', function test (done) {
        var users = torial('users');
        var id = 42;

        function onFind (err, user) {
            expect(err).to.be(null);

            expect(user.id).to.be(42);

            done();
        }

        users.findById(id, onFind);
    });

});
