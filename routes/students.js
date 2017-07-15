var express = require('express');
var router = express.Router();

var Class = require('../models/class');
var Student = require('../models/student');
var User = require('../models/user');

router.get('/classes', function(req, res, next) {
  Student.getStudentByUsername(req.user.username,function(err,student){
    if(err){
      console.log(err);
      res.send(err);
    }else{
      res.render('students/classes',{"student":student})
    }
  })
});

router.post('/classes/register',function(req,res){
  info = [];
  info['student_username'] = req.user.username;
  info['class_id'] = req.body.class_id;
  info['class_title'] = req.body.class_title

  Student.register(info,function(err,student){
    if(err)throw err;
    console.log(student);

  });
  req.flash('success', 'You are now registered')
  res.redirect('/students/classes');
})

module.exports = router;
