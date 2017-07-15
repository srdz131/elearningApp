var mongoose = require('mongoose');

//user schema
var instructorSchema = mongoose.Schema({

  first_name:{
    type:String
  },
  last_name:{
    type:String
  },
  adress:[{
    street_adress:{type:String},
    city:{type:String},
    country:{type:String}
  }],
  username:{
    type:String
  },
  email:{
    type:String
  },
  classes: [{
      class_id:{type:mongoose.Schema.Types.ObjectId},
      class_title: {type:String}
  }]

});
var Instructor = module.exports = mongoose.model('Instructor', instructorSchema);


module.exports.getInstructorByUsername = function(username,callback){
  var query = {username}
  Instructor.findOne(query, callback);
};


module.exports.register = function(info,callback){
  instructor_username = info['instructor_username'];
  class_id = info['class_id'];
  class_title = info['class_title'];

  var query = {username: instructor_username};

  Instructor.findOneAndUpdate(query,
  {$push: {'classes':{class_id,class_title}}},
  {safe: true, upsert:true},
callback);
}
