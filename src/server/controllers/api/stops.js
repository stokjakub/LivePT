var express = require('express');
var router = express.Router();


var Stops = require('../../models/stops');
// Wrap all the methods in an object

/*
var stops = {
  read: function(req, res, next){
    res.json({type: "Read", id: req.params.id});
  },
  create: function(req, res, next){
    res.send(req.body);
  },
  update: function(req, res, next){
    res.json({type: "Update", id: req.params.id, body: req.body });
  },
  delete: function(req, res, next){
    res.json({type: "Delete", id: req.params.id});
  },

  getAll: function(req, res, next){
    Stops.find(function(err, data){
      if(err) console.error();
      res.json(data);
    })
  } 
};
*/

router.get('/getallstops', function(req, res){
    //res.send('Api is working.');

    Stops.find(function(err, data){
        if(err) console.error();
        res.json(data);
    })
    2
});


// Return the object
module.exports = router;
