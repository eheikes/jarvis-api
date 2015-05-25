var express = require('express');
var router = express.Router();

/* GET stats. */
router.get('/', function(req, res, next) {
  res.send('GET /stats');
});

module.exports = router;
