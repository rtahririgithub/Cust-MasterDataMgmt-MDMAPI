var express = require('express');
var router = express.Router();
var greeter = require('./greeter');
//const logger = require('../util/log');
// Home page route
router.get('/', function(req, res) {
  res.json(greeter(undefined));
});

// About page route
router.get('/greeting', function(req, res) {
    res.json(greeter(req.query.name));
});

router.get('/')
module.exports = router;
