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

module.exports = router;