var express = require('express');
var router = express.Router();

var Lines = require('../../models/lines');

router.get('/getAllLines', function(req, res){
  Lines.find(function(err, data){
    if(err) console.error();
    res.json(data);
  })
});



// Return the object
module.exports = router;
