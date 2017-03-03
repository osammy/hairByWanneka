var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var buyerSchema = new Schema({
    message:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
  
}, {
    timestamps:true
});

//the schema is useless so far
// we need to creat a model using it

var Buyers = mongoose.model('Buy', buyerSchema);
//make this available to our node application
module.exports = Buyers;
