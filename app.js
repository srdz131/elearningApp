var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bcrypt = require('bcryptjs');
var helmet = require('helmet');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongodb = require('mongodb');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
async = require('async');

if(!process.env.MONGOLAB_USERNAME){
  env  = require('./env');
}
mongoose.connect(`mongodb://${process.env.MONGOLAB_USERNAME}:${process.env.MONGOLAB_PASSWORD}@ds159892.mlab.com:59892/elearning`, {useMongoClient: true});
var db = mongoose.connection;

var index = require('./routes/index');
var users = require('./routes/users');
var classes = require('./routes/classes');
var students = require('./routes/students');
var instructors = require('./routes/instructors');
var about = require('./routes/about');
var dashboard = require('./routes/dashboard');


var app = express();

app.locals.truncateText = function(text,length){
  var truncatedText = text.substring(0,length).concat('...');
  return truncatedText;
};

app.use(helmet());
app.use(compression());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');




// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//SESSION

app.use(session({
  secret:'secret',
  saveUninitialized: true,
  resave: true
}));

//PASSPORT
app.use(passport.initialize());
app.use(passport.session());

//EXPRESS-VALIDATOR

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//connect-flash

app.use(flash());
app.use(function(req,res,next){
  res.locals.messages = require('express-messages')(req,res);
  next();
});

//Make db accesable to router
app.use(function(req,res,next){
  req.db = db;
  next();
});

app.get('*',function(req,res,next){
  res.locals.user = req.user || null;
  if(req.user){
    res.locals.type = req.user.type;
    if(req.user.type == 'instructor'){
      res.locals.instructor = req.user.type;
      console.log('come here');
    }
  }

  next();
});

app.use('/', index);
app.use('/users', users);
app.use('/classes',classes);
app.use('/students', students);
app.use('/instructors', instructors);
app.use('/about',about);
app.use('/dashboard',dashboard);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;

  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
