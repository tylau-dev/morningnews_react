var express = require('express');
var router = express.Router();

var uid2 = require('uid2')
var bcrypt = require('bcrypt');

var userModel = require('../models/users')
var wishlistsModel = require('../models/wishlists')

router.post('/sign-up', async function(req,res,next){

  var error = []
  var result = false
  var saveUser = null
  var token = null

  const data = await userModel.findOne({
    email: req.body.emailFromFront
  })

  if(data != null){
    error.push('utilisateur déjà présent')
  }

  if(req.body.usernameFromFront == ''
  || req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }


  if(error.length == 0){

    var hash = bcrypt.hashSync(req.body.passwordFromFront, 10);
    var newUser = new userModel({
      username: req.body.usernameFromFront,
      email: req.body.emailFromFront,
      password: hash,
      token: uid2(32),
    })
  
    saveUser = await newUser.save()
  
    
    if(saveUser){
      result = true
      token = saveUser.token
    }
  }
  

  res.json({result, saveUser, error, token})
})

router.post('/sign-in', async function(req,res,next){

  var result = false
  var user = null
  var error = []
  var token = null
  
  if(req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }

  if(error.length == 0){
    const user = await userModel.findOne({
      email: req.body.emailFromFront,
    })
  
    
    if(user){
      if(bcrypt.compareSync(req.body.passwordFromFront, user.password)){
        result = true
        token = user.token
      } else {
        result = false
        error.push('mot de passe incorrect')
      }
      
    } else {
      error.push('email incorrect')
    }
  }
  

  res.json({result, user, error, token})


})

router.put('/set-language', async function(req, res){

  try {
    const data = await userModel.updateOne({token: req.body.token}, {language: req.body.language})
    var result = true
  }
  catch (error) {
    var result = false
  }
  
  res.json({result, token:req.body.token, language:req.body.language})
})

router.post('/add-wishlist', async function(req, res){

  try {
    const newWishlist =  new wishlistsModel({
      articles : [ { title: req.body.title, description: req.body.description, content: req.body.content, image: req.body.image, language: req.body.language } ]
    });
    savedArticle = await newWishlist.save();

    var user = await userModel.findOneAndUpdate({token: req.body.token},{wishlist: savedArticle.id});

    var result = true;
  }
  catch (error) {
    var result = false
  }

  res.json({result, savedArticle})
})


module.exports = router;
