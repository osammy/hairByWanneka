var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Products = require('../models/products');
var Verify = require('./verify');




var productRouter = express.Router();
productRouter.use(bodyParser.json());

productRouter.route('/')

.get(function(req,res,next) {
    Products.find(req.query, function(err,product){
        if(err) next(err);
        res.json(product);

    });

})


.post(Verify.verifyOrdinaryUser,function(req,res,next) {
    Products.create(req.body, function(err,product) {
        if(err) next(err);

        console.log('Product Created!');
        var id = product._id;
        res.writeHead(200, {
            'ContentType':'text/plain'
        });
        res.end('Added the product with id: ' +id);
    });

})
//
// .delete(Verify.verifyOrdinaryUser,function(req,res,next) {
//     Products.remove({}, function(err, resp){
//         if(err) throw err;
//         res.json(resp);
//     });
// });

productRouter.route('/:productId')

.get(function(req,res,next){
    Products.findById(req.params.productId, function(err, product) {
        if (err) next(err);
        res.json(product);
    });
})

productRouter.route('/:productId/reviews')
.get(function(req,res,next){
    Products.findById(req.params.productId, function(err, product) {
        if (err) next(err);

          res.json(product);
    });
})

.post(Verify.verifyOrdinaryUser, function(req,res,next) {
    Products.findById(req.params.productId, function(err,product) {
        if (err) next(err);

        req.body.postedBy = req.decoded._id;
        var prod = {};
        prod.rating = req.body.rating;
        prod.review = req.body.review;
        product.reviews.push(prod);
        console.log(product.reviews)

        product.save(function() {
            if (err) next(err);

            console.log('Added new product review');
            res.json(product);
        });
    });
})


.delete(Verify.verifyOrdinaryUser, function(req,res,next) {
    Products.findById(req.params.productId, function(err, product) {
        if(err) throw err;

        for(var i =0;i<(product.reviews.lenght-1);i++) {
            product.reviews.id(product.reviews[i]._id).remove();//remove function is not supported on embedded arrays so we have to use a for loop to remove all the comments.
        }

        product.save(function(err, result) {
            if(err) throw err;

            res.writeHead(200, {
                'ContentType':'text/plain'
            });

            res.end('Deleted my product review');
        });
    });
});

productRouter.route('/:productId/reviews/:reviewId')

.put(Verify.verifyOrdinaryUser,function(req,res,next) {
    Products.findById(req.params.productId, function(err, product) {
        if(err) next(err);

        product.reviews.id(req.params.reviewId).remove();

        product.reviews.push(req.body);

        product.save(function() {
            if(err) throw err;
            console.log('Comments Updated');
            res.json(product);
        });
    });
})

.delete(Verify.verifyOrdinaryUser, function(req,res,next) {
    Products.findById(req.params.productId, function(err, product) {
        if(err)  next(err);

            product.reviews.id(req.params.productId).remove();//remove function is not supported on embedded arrays so we have to use a for loop to remove all the comments.

            product.save(function(err, result) {
            if(err) next(err);

            res.writeHead(200, {
                'ContentType':'text/plain'
            });

            res.end('Deleted my product review');
        });
    });
});

module.exports = productRouter;
