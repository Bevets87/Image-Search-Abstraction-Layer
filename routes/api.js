var express = require('express');
var router = express.Router();
var imgSearchController = require('../controllers/imgSearchController.js');

router.get('/imgSearch/:query', imgSearchController.create_query_get);

router.get('/latest/imgSearch', imgSearchController.get_latest);

module.exports = router;
