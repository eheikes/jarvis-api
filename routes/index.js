'use strict';

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var base = req.protocol + '://' + req.get('host');
  res.json({
    stats: base + '/stats',
    suggestions: base + '/suggest'
  });
});

module.exports = router;
