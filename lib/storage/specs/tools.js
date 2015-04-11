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

var path = require('path');

process.env.CAHOOTS_PROVIDER_TORIAL_DATABASE_PATH = path.join(process.cwd(), 'database');
