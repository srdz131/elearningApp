var mongoose = require('mongoose');

//class schema
var classSchema = mongoose.Schema({
  title:{
    type:String
  },
  description:{
    type:String
  },
  instructor:{
    type:String
  },
  lessons:[{
    lesson_number:{type:Number},
    lesson_title:{type:String},
    lesson_body:{type:String}
  }]
});
var Class = module.exports = mongoose.model('class', classSchema);

//fetch all classes
module.exports.getClasses = function(callback,limit){
  Class.find(callback).limit(limit);
};

module.exports.getClassesById = function(id,callback){
  Class.findById(id, callback);
};

module.exports.addLesson = function(info,callback){
  class_id = info['class_id'];
  lesson_number = info['lesson_number'];
  lesson_title = info['lesson_title'];
  lesson_body = info['lesson_body'];

  Class.findByIdAndUpdate(
    class_id,
    {$push:{'lessons':{lesson_number,lesson_title,lesson_body}}},
    {safe:true, upsert:true},
    callback
  );

};
//function to trim text
module.exports.truncText = function(length){
  return this.description.substring(0,length) + '...';
};
