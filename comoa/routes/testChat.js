 
var express = require('express');
var router = express.Router();
 
/* GET chat listing. */
router.get('/', function(req, res, next) {
    res.render('testchat', { title: 'chat tutorial' }); // View 에 chat.jade 를 추가해야됨
 
});
module.exports = router;
