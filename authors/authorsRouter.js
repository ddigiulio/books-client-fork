const express = require('express');
const router = express.Router();
const passport = require('passport');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
var mongoose = require('mongoose');
const axios = require('axios')
const parseString = require('xml2js').parseString
router.use(jsonParser);
const { User } = require('../users/models')

const { authors } = require('./models')

const jwtAuth = passport.authenticate('jwt', { session: false });
const loadUser = function (req, res, next) {
    if (req.user.id) {
        User.findById(req.user.id)
            .then(user => {
                req.user = user
                next();
            })
    }
    else {
        next({
            error: "No Authenticated User"
        });
    }
}

router.post("/:name", jwtAuth, loadUser, function(request, response){
    let user = request.user
    var url =  "https://www.goodreads.com/api/author_url/"
    var id = request.params.name
    var myurl = url + id;
    var key = "u357GGD3r1AuoeoFpQz2Q"
    axios.get(myurl, {
    params: {
      key
    }
    })
    .then(function (data) {
      
      parseString(data.data, function (err, result) {  
      const param = result.GoodreadsResponse.author[0].$.id
      const url = "http://localhost:8080/authors/" + param
      
      axios.get(url)
        .then(result => {
            const parsed = result.data.GoodreadsResponse.author[0]       
            // const book = parsed.books[0].book

            authors.create({
                name: parsed.name[0],
                about: parsed.about[0],
                imageSrc: parsed.image_url[0],
                largeImageSrc: parsed.large_image_url[0],
                born: parsed.born_at[0],
                died: parsed.died_at[0],
                hometown: parsed.hometown[0],
                // books: parsed.books[0].book
            })
            .then(author => {
                user.topAuthors.push(author)
                user.save()
                .then( () => {
                    response.send(user.topAuthors)
                })
            })
      })
      });  
    })
    .catch(function (error) {
      console.log(error);
      response.send(error);
    });
  })

router.get("/:id", function(request, response){

    var url =  "https://www.goodreads.com/author/show/" 
    var id = request.params.id
    var myurl = url + id;
    var key = "u357GGD3r1AuoeoFpQz2Q"
    axios.get(myurl, {
    params: {
      key
    }
    })
    .then(function (data) {
      
      parseString(data.data, function (err, result) {
        
      response.send(result)
  });
      
    })
    .catch(function (error) {
      console.log(error);
      response.send(error);
    });
  })


  module.exports = { router };