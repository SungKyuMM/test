var express = require('express');
var router = express.Router();

const infectionController = require('../controller/infectionStatusController');

router.post('/infectionSearch', infectionController.searchInfection);



module.exports = router;