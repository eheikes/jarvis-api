var express = require('express');
var router = express.Router();

/* GET stats. */
router.get('/', function(req, res, next) {
  res.json({
    today: { added: 9, deleted: 1 },
    week: { added: 42, deleted: 49 }
  });
});

module.exports = router;
