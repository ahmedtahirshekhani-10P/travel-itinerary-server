const User = require('../models/users');
// const { normalizeErrors } = require('../helpers/mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.registerUser = (req, res) => {
    const { name, email, username, password } = req.body;
    User.findOne({username}, function(err, existingUser) {
      if (err) {
        return res.status(422).send({success: false, message: err.errors});
      }
  
      if (existingUser) {
        return res.status(422).send({ success: false,
          message: "Username already there"});
      }

      const user = new User({
        name,
        email,
        username,
        password
      });
      user.save(function(err) {
        if (err) {
          return res.status(422).send({success: false, message: err.errors});
        }
  
        return res.json({success: true,
          message: "Registered Successful"});
      });



    })
    
        
     
    }

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
    const resp = await User.findOne({ username, password });
   
    if (resp) {
      const token = jwt.sign({
        userId: resp._id,
        username: resp.username
      }, config.SECRET, { expiresIn: '1h'});
      
      res.send({
        success: true,
        message: token,
      });
    } else {
      res.send({
        success: false,
        message: "Login attempt failed!",
      });
    }
  }

exports.getUsers = async (req, res) => {
    const resp = await User.find({}, {"_id": 0, "username": 1, "email":2});
    // console.log(resp)
    if (resp) {
      res.send({
        success: true,
        message: resp,
      });
    } else {
      res.send({
        success: false,
        message: "Api failed! Error",
      });
    }
  }

  exports.authMiddleware = function(req, res, next) {
    const token = req.headers.authorization;
      if (token) {
        let user = {}
        try{
           user = parseToken(token);
        }
        catch(e){
          return res.status(422).send({errors: e});

        }
        
        User.findById(user.userId, function(err, {_id, name, email, username}) {
          if (err) {
            return res.status(422).send({errors: err.errors});
          }
    
          if (user) {
            res.locals.user = {_id, name, email, username};
            // console.log(res.locals.user)
            next();
          } else {
            return notAuthorized(res);
          }
        })
      } else {
        return notAuthorized(res);
      }
    }
    
    function parseToken(token) {
      // console.log("working")
      return jwt.verify(token.split(' ')[1], config.SECRET);
    }
    
    function notAuthorized(res) {
      return res.status(401).send({errors: [{title: 'Not authorized!', detail: 'You need to login to get access!'}]});
    }
    
  

  exports.getSingleUser = async (req,res) => {
    const username = req.params.username
    const resp = await User.findOne({ username });
    if(resp){
      res.send({
        success:true,
        message:resp
      })
    }
    
  }

  exports.isLoggedIn = (req, res)=>{
    console.log("check")
  }