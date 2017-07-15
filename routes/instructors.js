var express = require('express');
var router = express.Router();

var Class = require('../models/class');
var Instructor = require('../models/instructor');
var User = require('../models/user');

router.get('/classes', function(req, res, next) {
  Instructor.getInstructorByUsername(req.user.username,function(err,instructor){
    if(err){
      console.log(err);
      res.send(err);
    }else{
      res.render('instructors/classes',{"instructor":instructor});
    }
  });
});

router.get('/classes/add',ensureAuthenticated,function(req,res,next){
  Instructor.getInstructorByUsername(req.user.username,function(err,instructor){
    if(err){
      console.log(err);
      res.send(err);
    }else{
      res.render('classes/add',{"instructor":instructor});
    }
  });
});
router.post('/classes/add',ensureAuthenticated,function(req,res,next){
  var title = req.body.title || null;
  var description = req.body.description || null;
  var instructor = req.body.instructor || null;

  var newClass = new Class({title, description, instructor});

  newClass.save(function(err){
    if(err){
      console.log(err);
      throw err;
    }
    console.log('Classes added');
    res.redirect('/classes');
  })

});

router.post('/classes/register',ensureAuthenticated,function(req,res){
  info = [];
  info['instructor_username'] = req.user.username;
  info['class_id'] = req.body.class_id;
  info['class_title'] = req.body.class_title;

  Instructor.register(info,function(err,instructor){
    if(err)throw err;
    console.log(instructor);

  });
  req.flash('success', 'You are now registered to instruct this class');
  res.redirect('/instructors/classes');
});

router.get('/classes/:id/lessons/new', ensureAuthenticated,function(req, res, next) {
  res.render('instructors/newlesson',{'class_id': req.params.id});
});
router.post('/classes/:id/lessons/new', function(req, res, next) {
  var info = [];
  info['class_id'] = req.params.id;
  info['lesson_number'] = req.body.lesson_number;
  info['lesson_title'] = req.body.lesson_title;
  info['lesson_body'] = req.body.lesson_body;
  console.log(info);
  Class.addLesson(info, function(err,lesson){
    if(err){
      throw err;
    }
    console.log('Lesson added');

  });
  req.flash('success','Lesson added');
  res.redirect('/instructors/classes');
});

function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

module.exports = router;
