var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Dishes = require('../models/dishes');
var Verify = require('./verify');




var dishRouter = express.Router();
dishRouter.use(bodyParser.json());

// var SmsGateway = require('../smsgateway/SmsGateway');
// var gateway = new SmsGateway('osamaimafidon@gmail.com','samorai11');
// var id= 33759;var options =[];
dishRouter.route('/')

// .get(Verify.verifyOrdinaryUser,function(req,res,next) {
//     Dishes.find({}, function(err,dish){
//         if(err) throw err;
//         res.json(dish);
//
//     });
// })


.get(function(req,res,next) {
     Dishes.find({}, function(err,dish){
         if(err) throw err;
         res.json(dish);

     });



//
//    gateway.getDevice(id).then(function(data){
//    console.log('getDevices Success');
//
//    res.json(JSON.parse(JSON.stringify(data)));
//
//    console.log(data);
//
//}).fail(function(message){
//    console.log('failed',message);
//});
})

// .post(Verify.verifyOrdinaryUser,function(req,res,next) {
//     Dishes.create(req.body, function(err,dish) {
//         if(err) throw err;

//         console.log('Dish Created!');
//         var id = dish._id;
//         res.writeHead(200, {
//             'ContentType':'text/plain'
//         });
//         res.end('Added the dish with id: ' +id);
//     });
// })


.post(function(req,res,next) {
    // Dishes.create(req.body, function(err,dish) {
    //     if(err) throw err;

    //     console.log('Dish Created!');
    //     var id = dish._id;
    //     res.writeHead(200, {
    //         'ContentType':'text/plain'
    //     });
    //     res.end('Added the dish with id: ' +id);
    // });

     res.writeHead(200, {
            'ContentType':'text/plain'
        });
        res.end('Added the dish with id: ');

})

.delete(Verify.verifyOrdinaryUser,function(req,res,next) {
    Dishes.remove({}, function(err, resp){
        if(err) throw err;
        res.json(resp);
    });
});

dishRouter.route('/:dishId')

.get(function(req,res,next){
    Dishes.findById(req.params.dishId, function(err, dish) {
        if (err) throw err;
        res.json(dish);
    });
})

.put(function(req,res,next) {
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set:req.body
    }, {
        new:true
    },function (err,dish) {
        if(err) throw err;

        res.json(dish);
    })
})

.delete(function(req,res,next) {
    Dishes.remove(req.params.dishId, function(err, resp){
        if(err) throw err;
        res.json(resp);
    });
});

dishRouter.route('/:dishId/comments')
.get(function(req,res,next){
    Dishes.findById(req.params.dishId, function(err, dish) {
        if (err) throw err;
        res.json(dish.comments);
    });
})

.post(function(req,res,next) {
    Dishes.findById(req.params.dishId, function(err,dish) {
        if(err) throw err;

        dish.comments.push(req.body);

        dish.save(function() {
            if(err) throw err;

            console.log('Updated Commnets');
            res.json(dish);
        });
    });
})


.delete(function(req,res,next) {
    Dishes.findById(req.params.dishId, function(err, dish) {
        if(err) throw err;

        for(var i =0;i<(dish.comments.lenght-1);i++) {
            dish.comments.id(dish.comments[i]._id).remove();//remove function is not supported on embedded arrays so we have to use a for loop to remove all the comments.
        }

        dish.save(function(err, result) {
            if(err) throw err;

            res.writeHead(200, {
                'ContentType':'text/plain'
            });

            res.end('Deleted all the commnents');
        });

    });
});

dishRouter.route('/:dishId/comments/:commentId')
.get(function(req,res,next){
    Dishes.findById(req.params.dishId, function(err, dish) {
        if (err) throw err;
        res.json(dish.comments.id(req.params.commentId));
    });
})

.put(function(req,res,next) {
    Dishes.findById(req.params.dishId, function(err, dish) {
        if(err) throw err;

        dish.comment.id(req.params.commetId).remove();

        dish.comments.push(req.body);

        dish.save(function() {
            if(err) throw err;
            console.log('Comments Updated');
            res.json(dish);
        });
    });
})

.delete(function(req,res,next) {
    Dishes.findById(req.params.dishId, function(err,dish) {
        dish.comments.id(req.params.commentId).remove();

        dish.save(function(err, resp) {
            res.json(resp);
        });
    });
});



module.exports = dishRouter;
