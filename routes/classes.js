var express = require('express');
var router = express.Router();

var Class = require('../models/class');
/* GET classes page. */
router.get('/', function(req, res, next) {
  Class.getClasses(function(err,classes){

    if(err){
      console.log(err);
      res.send(err);
    }else{

      res.render('classes/index',{"classes": classes})
    }
  });
});

router.get('/:id/details',function(req,res,next){
  Class.getClassesById(req.params.id,function(err,className){
    if(err){
      console.log(err);
    }else{
      res.render('classes/details', {'class': className})
    }
  });
});

router.get('/:id/lessons', ensureAuthenticated ,function(req,res,next){
  Class.getClassesById(req.params.id, function(err,classname){
    if(err){
      throw err;
    }
    res.render('classes/lessons',{'class':classname});
  });
});

router.get('/:id/lessons/:lesson_id', ensureAuthenticated ,function(req,res,next){
  Class.getClassesById(req.params.id, function(err,classname){
    var lesson;
    if(err){
      throw err;
    }
    for(var i = 0;i<classname.lessons.length;i++ ){
      if(classname.lessons[i].lesson_number == req.params.lesson_id){
        lesson  = classname.lessons[i];
      }
    }
    res.render('classes/lesson', {'class':classname,'lesson':lesson});
  })
})

function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

module.exports = router;
