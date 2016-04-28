var express = require('express');
var router = express.Router();
var request = require("request");

var keys = require('../not_shared.json');




router.get('/getapi', function(req, res){
    var url1 = "http://www.wienerlinien.at/ogd_realtime/monitor?sender=";
    var sender = keys.wldevkey;
    //var sender = keys.wlkey;
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
    var sender = keys.wldevkey;
    //var sender = keys.wlkey;
    var url2 = "&rbl=";
    var rbl = req.param('rbl');
    console.log(rbl);
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




router.get('/getStopApis', function(req, res){



});

module.exports = router;