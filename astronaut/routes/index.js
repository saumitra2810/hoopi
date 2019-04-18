var express = require('express');
var fs = require('fs');
var router = express.Router();
var request = require('request');

var storeEndpoint = "https://store-dev.swymrelay.com/api/v2/provider/";
var pid = "oQtcz5u8vgt9+gDMUPdJqE91OFWbmUZIGITSoS0y03A=";

/* GET home page. */
router.get('/', function(req, res, next) {
  var pid = req.query.pid;
  console.log(pid);
  var cookies = req.cookies;
  request('http://localhost:3000/stylesheets/style.css', function (error, response, cssContent) {
    if (error) console.log(error);
    var regid = cookies["swym-regid"];
    var sessionid = cookies["swym-sessionid"];
    request.post({url: storeEndpoint + "fetchWishlist?pid=" + encodeURIComponent(pid), form: {regid: regid, sessionid: sessionid, days: 30}}, function(err, httpResponse, body){
      res.render('index', { title: 'Express', content: JSON.parse(body), csscontent: cssContent  });
    });
  });
});

router.get('/siteinject', function(req, res, next) {
  res.render('siteinject', {});
});

module.exports = router;
