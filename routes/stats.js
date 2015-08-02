'use strict';

var express = require('express');
var plugins = require('../plugins');
var router = express.Router();

/* GET stats. */
router.get('/', function(req, res, next) {
  plugins.getStats().then(function(stats) {
    res.json(stats);
  });
});

module.exports = router;
