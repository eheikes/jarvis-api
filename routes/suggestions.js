var express = require('express');
var plugins = require('../plugins');
var router = express.Router();

/* GET suggestions. */
router.get('/', function(req, res, next) {
  plugins.getSuggestions().then(function(suggestions) {
    res.json(suggestions);
  });
});

module.exports = router;
