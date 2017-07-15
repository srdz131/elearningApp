var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash')

var User = require('../models/user');
var Student = require('../models/student');
var Instructor = require('../models/instructor')

/* GET users listing. */
router.get('/signup', function(req, res, next) {
  res.render('users/signup')
});

/* POST form */
router.post('/signup', function(req,res,next){
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var street_adress = req.body.street_adress;
  var city = req.body.city;
  var country = req.body.country;
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var password2 = req.body.password2;
  var type = req.body.type;

  req.checkBody('email','You entered invalid email format').isEmail();
  req.checkBody('password2','Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if(errors){
    res.render('users/signup',{
      errors,
      first_name,
      last_name,
      street_adress,
      city,
      country,
      email,
      username,
      password,
      password2})
    }else{

      //create newUser instance of user model
      var newUser = new User({
        email,username,password,type
      });

      //create newStudent instance of Student model
      var newStudent = new Student({
        first_name:first_name,
        last_name:last_name,
        adress: [{
          street_adress:street_adress,
          city:city,
          country:country
        }],
        email:email,
        username:username
      });
      //create newInstructor instance of Instrucor model{
      var newInstructor = new Instructor({
        first_name:first_name,
        last_name:last_name,
        adress: [{
          street_adress:street_adress,
          city:city,
          country:country
        }],
        email:email,
        username:username
      });

      if(type == 'student'){

        User.saveStudent(newUser,newStudent,function(err,user){

        });
      }else{

        User.saveInstructor(newUser,newInstructor,function(err,user){
  
        });
      }
      req.flash('success','User added');
      res.location('/');
      res.redirect('/');
    }

    })

passport.serializeUser(function(user,done){
  done(null,user._id);
});
passport.deserializeUser(function(id,done){
  User.getUserById(id,function(err,user){
    done(err,user)
  });
});

passport.use(new LocalStrategy(function(username,password,done){
  User.getUserByUsername(username,function(err,user){
    if(err) throw err;
    if(!user){
      return done(null,false,{message:'Unknown user '+username});
    }
    User.comparePasswords(password,user.password,function(err,isMatch){
      if(err) return done(err);
      if(isMatch){
        return done(null,user);
      }else{
        console.log('invalid password');
        return done(null,false,{message:'Invalid password'});
      }
    })
  })
}))

router.post('/login',passport.authenticate('local',{failureRedirect:'/',failureFlash:'Wrong username or password'}),function(req,res,next){
  console.log('you are in')
  req.flash('success','You are logged in');
  res.redirect('/dashboard')
})

//LOGOUT

router.get('/logout', function(req,res){
  req.logout();
  req.flash('success', 'You have logged out.');
  res.redirect('/')
})
function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

module.exports = router;
