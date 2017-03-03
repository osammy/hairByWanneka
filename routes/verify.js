var User = require('../models/user');
var jwt = require('jsonwebtoken');//used to create, sign, and verify token

var config = require('../config.js');

exports.getToken = function(user) {
    var secret = toString(config.secretKey); // secret must be either a string or a buffer
    return jwt.sign(user, secret,{
        expiresIn:3600
    });
};

exports.verifyOrdinaryUser = function(req,res,next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

   //decode token
    var secret = toString(config.secretKey); //secret must be a string or a buffer otherwise the json.verify() function will fail, and it may not tell you that this is the reason.
    if(token) {
        jwt.verify(token, secret, function(err, decoded) {
            if(err) {
                var err = new Error('you are not authenticated!');
                err.status = 401;
                console.log(err);
                return next(err);
            } else {
                //if everything is good, save to request for use in other routes
                console.log(decoded);
                req.decoded = decoded;
                next();
            }

        });
    } else {
        var err = new Error('No token provided');
        err.status = 403;
        return next(err);
    }

}

exports.verifyAdmin = function(req,res,next) {

if(!req.decoded) {
  var err = new Error('Only admins are authorized to perform this');
  err.status = 403;
  return next(err);
} else {
  var id = req.decoded._id;

  if(!req.decoded.admin) {
    var err = new Error('Only admins are authorized to perform this action');
    err.status = 403;
    return next(err);
  } else {
    next(err);
  }
}




}
