var express = require('express');
var router = express.Router();
var request = require("request");

var keys = require('../not_shared.json');




router.get('/getapi', function(req, res){
    var url1 = "http://www.wienerlinien.at/ogd_realtime/monitor?sender=";
    //var sender = keys.wldevkey;
    var sender = keys.wlkey;
    var url2 = "&rbl=4103";
    var url = url1 + sender + url2;
    request({
        url: url,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            res.json(body);
        }
    });

});

router.get('/getoneapi', function(req, res){
    var url1 = "http://www.wienerlinien.at/ogd_realtime/monitor?sender=";
    //var sender = keys.wldevkey;
    var sender = keys.wlkey;
    var url2 = "&rbl=";
    var rbl = req.param('rbl');
    var url = url1 + sender + url2 + rbl;
    request({
        url: url,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            res.json(body);
        }
    });
});

router.get('/getapifromrbls', function(req, res){
    var url1 = "http://www.wienerlinien.at/ogd_realtime/monitor?sender=";
    //var sender = keys.wldevkey;
    var sender = keys.wlkey;
    var url = url1 + sender;
    var rbls = req.param('rbls');
    console.log(rbls);
    if (rbls.constructor === Array){
        rbls.forEach(function(rbl_current){
            var rblc = "&rbl=";
            var rbl = rbl_current;
            url+= rblc + rbl;
        });
    }else{
        var rblc = "&rbl=";
        var rbl = rbls;
        url+= rblc + rbl;
    }


    request({
        url: url,
        json: true
    }, function (error, response, body) {
            res.json(body);
    });

});


router.get('/reversegeocode', function(req, res){
  var lat = req.param('lat');
  var lng = req.param('lng');

  var url = "http://api.geonames.org/findNearbyPlaceNameJSON?lat=";
  url +=  lat;
  url +=  "&lng=";
  url +=  lng;
  url +=  "&username=stokjakub";
  request({
    url: url,
    json: true
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      res.json(body);
    }
  });
});

router.get('/getinterrupt', function(req, res){


    var url1 = "http://www.wienerlinien.at/ogd_realtime/trafficInfoList?";

    //var line = "relatedLine=18";
    var name = "name=stoerunglang&name=stoerungkurz";
    var sender ="&sender=";

    var key = keys.wldevkey; //keys.wlkey;

    var url = url1 + name + sender + key;

    request({
        url: url,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            res.json(body);
        }
    });

});




router.get('/getCar2Go', function(req, res){
  var url = "https://www.car2go.com/api/v2.1/vehicles?loc=wien&oauth_consumer_key=car2gowebsite&format=json";
  request({
    url: url,
    json: true
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      res.json(body);
    }
  });
});

module.exports = router;
