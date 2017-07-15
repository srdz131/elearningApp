var express = require('express');
var router = express.Router();

var Class = require('../models/class');

//GET DASHBOARD PAGE
router.get('/', function(req,res,next){
  Class.getClasses(function(err,classes){
    if(err){
      console.log(err);
      res.send(err);
    }else{
      res.render('dashboard/dashboard',{"classes": classes,"orbit":true});
    }
  },4);
});


module.exports = router;
