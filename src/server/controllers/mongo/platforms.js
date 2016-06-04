var express = require('express');
var router = express.Router();
var keys = require('../../not_shared.json');
var request = require("request");

var Platforms = require('../../models/platforms');

router.get('/getStopPlatformsArrivals', function(req, res){
    var stopID = req.param('stopID');

    Platforms.distinct(
        "RBL_NUMMER",
        {
            FK_STATION_ID : stopID
        },function(err, rbls){
        if(err) console.error();
        populatePlatformsWithApi(rbls, function (response){
            res.json(response);
        });
    })
});

populatePlatformsWithApi = function(rbls, callback){
    var aggregation = [];
    for (var i = 0; i < rbls.length; i++){
        //console.log(rbls[i]);
        var url1 = "http://www.wienerlinien.at/ogd_realtime/monitor?sender=";
        var sender = keys.wldevkey;
        var url = url1 + sender;
        url += "&rbl=";
        url += rbls[i];
        request({
            url: url,
            json: true,
            rbl: rbls[i]
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                aggregation.push([response.request.rbl, body]);
                if (aggregation.length == rbls.length){
                    callback(aggregation);
                }
            }
        });
    }


};

router.get('/getMultipleStopsPlatforms', function(req, res){
  var stops = req.param('stops');
  var output = [];

  for (var i = 0; i < stops.length; i++){


    var platfroms = [];
    output.push(platforms);
  }

});


// Return the object
module.exports = router;
