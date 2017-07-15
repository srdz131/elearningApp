var mongoose = require('mongoose');
var bcrypt = require('bcryptjs')
mongoose.Promise = global.Promise
//user schema
var userSchema = mongoose.Schema({
  username:{
    type:String
  },
  email:{
    type:String
  },
  password:{
    type:String,
    bcrypt:true
  },
  type:{
    type:String
  }
});

var User = module.exports = mongoose.model('User', userSchema);

//fetch all classes
module.exports.getUserById = function(id,callback){
  User.findById(id,callback);
}
module.exports.getUserByUsername = function(username,callback){
  var query = {username}
  User.findOne(query, callback);
}

//save  student

module.exports.saveStudent = function(newUser,newStudent,callback){
  bcrypt.hash(newUser.password,8 , function(err,hash){
    if(err){
      console.log('hashing error', err);
    }
    newUser.password = hash;
    console.log('Student is being saved');
    async.parallel([function(callback){
      newUser.save();
      callback();
    },function(callback){
      newStudent.save();
      callback();
    }], callback);
  })
}

//save instructor

module.exports.saveInstructor = function(newUser,newInstructor,callback){
  bcrypt.hash(newUser.password ,10, function(err,hash){
    console.log('hashed instructor')
    if(err){
      console.log('hashing error', err);
    }
    newUser.password = hash;
    console.log('Instrucor is being saved');
    async.parallel([function(callback){
      newUser.save();
      callback();
    },function(callback){
      newInstructor.save();
      callback();
    }], callback);
  })}

module.exports.comparePasswords = function(candidatePassword,hash,callback){
  bcrypt.compare(candidatePassword,hash, function(err,isMatch){
    if(err){
      throw err;
    }
    callback(null,isMatch);
  })
}
