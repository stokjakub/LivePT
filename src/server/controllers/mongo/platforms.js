var express = require('express');
var router = express.Router();

var Platforms = require('../../models/platforms');

router.get('/getstopplatforms', function(req, res){
    Platforms.find({
        FK_STATION_ID : 214461177
    },function(err, data){
        if(err) console.error();
        res.json(data);
    })
});



// Return the object
module.exports = router;
