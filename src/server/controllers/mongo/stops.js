var express = require('express');
var router = express.Router();


var Stops = require('../../models/stops');


router.get('/getallstops', function(req, res){
    Stops.find(function(err, data){
        if(err) console.error();
        res.json(data);
    })
});
router.get('/getstop', function(req, res){
    Stops.find({
        "STATION-ID": 214460676
    },function(err, data){
        if(err) console.error();
        res.json(data);
    })
});


router.get('/getStopsInTheArea', function(req, res){
    var coordinates = JSON.parse(req.param('coordinates'));
    var zoom = req.param('zoom');
    console.log(coordinates.lat);

    Stops.find({
        WGS84_LON: { $gt:coordinates.lng - 0.01 , $lt: coordinates.lng + 0.01 },
        WGS84_LAT: { $gt: coordinates.lat - 0.01 , $lt: coordinates.lat + 0.01}
    },function(err, data){
        if(err) console.error();
        res.json(data);
    })
});


// Return the object
module.exports = router;
