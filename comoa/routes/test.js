var express = require('express');
var router = express.Router();

// 테이스용 페이지 (나중에 폭발)
router.get('/', function(req, res, next) {
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end("<h1>Test Page</h1>");
});

module.exports = router;