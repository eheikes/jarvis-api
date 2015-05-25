var express = require('express');
var router = express.Router();

/* GET suggestions. */
router.get('/', function(req, res, next) {
  res.send('GET /suggest');
});

module.exports = router;
