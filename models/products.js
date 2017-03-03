var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//will add Currency type to the mongoose Schema Types
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

var reviewSchema = new Schema({
    rating: {
        type:Number,
        min:1,
        max:5,
        required:true
    },
    review: {
        type:String,
        required:true
    },
    postedBy: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
}, {
    timestamps:true
});

var sizeSchema =new Schema({
  size:{
    type:String,
    required:true
  },
  qty:{
    type:Number,
    required:true
  }
});

var productSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    featured:{
      type:Boolean,
      default:false
    },
    imagePath:{
      type:String,
      required:true
    },
    imagePathThumb:{
      type:String,
      required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
      type:Currency,
      required:true,
      min:0
    },
    rating:{
      type:Number,
      default:0
    },

    code:{
      type:String,
      required:true,
      unique:true
    },
    reviews:[reviewSchema],
    sizeAvail:[sizeSchema]
}, {
    timestamps:true
});

//the schema is useless so far
// we need to creat a model using it

var Products = mongoose.model('Product', productSchema);
//make this available to our node application
module.exports = Products;
