'use strict';

const errorHandler = require('./error-handler.js');
const Auth = require('../model/auth.js');
const jsonWebToken = require('jsonwebtoken');

const ERROR_MESSAGE = 'Authorization Failed';

module.exports = function(req, res, next){
  
  let authHeader = req.headers.authorization;

  if(!authHeader)
    return errorHandler(new Error(ERROR_MESSAGE), res);

  let token = authHeader.split('bearer ')[1];

  if(!token)
    return errorHandler(new Error(ERROR_MESSAGE), res);
  
  jsonWebToken.verify(token, process.env.APP_SECRET, (err, decodedValue) => {
    if(err) {
      err.message = ERROR_MESSAGE;
      return errorHandler(err, res);
    }

    Auth.findOne({compareHash: decodedValue.token})
      .then(user => {

        if(!user)
          return errorHandler(new Error(ERROR_MESSAGE), res);

        req.user = user;
        next();
      })
      .catch(err => errorHandler(err, res));
  });
};