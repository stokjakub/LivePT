var express = require('express');
var router = express.Router();

var Platforms = require('../../models/lines');

router.get('/getallstops', function(req, res){
    Lines.find(function(err, data){
        if(err) console.error();
        res.json(data);
    })
});



// Return the object
module.exports = router;
