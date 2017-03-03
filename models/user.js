var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    email:String,
    username:String,
    firstname:{
      type:String,
      // required:true
    },
    lastname:{
      type:String,
      // required:true
    },
    password:String,
    phone:{
      type:Number,
      min:5,
      max:15
    },
    admin: {
        type:Boolean,
        default:false
    },
    address:String
  }, {
      timestamps:true

});

User.methods.fullName = function() {
  return (this.firstname + " " + this.lastname);
}

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);
