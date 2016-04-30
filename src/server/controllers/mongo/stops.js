var express = require('express');
var router = express.Router();


var Stops = require('../../models/stops');


router.get('/getAllStops', function(req, res){
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
    var factor = zoom * 0.001;
    Stops.find({
        WGS84_LON: { $gt:coordinates.lng - factor*2 , $lt: coordinates.lng + factor*2 },
        WGS84_LAT: { $gt: coordinates.lat - factor , $lt: coordinates.lat + factor}
    },function(err, data){
        if(err) console.error();
        res.json(data);
    })
});

router.get('/searchStops',function(req, res){

});


// Return the object
module.exports = router;
