const express = require('express');
const router = express.Router();
const passport = require('passport');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
var mongoose = require('mongoose');
const axios = require('axios')
const parseString = require('xml2js').parseString
router.use(jsonParser);
const {User} = require('../users/models')

const { books } = require('./models')

const jwtAuth = passport.authenticate('jwt', { session: false });
const loadUser = function(req, res, next) {
    if(req.user.id){
        User.findById(req.user.id)
        .then(user => {
            req.user = user
            next();
        })
    }
    else{
        next({
           error: "No Authenticated User"
        });
    }
}
// router.get("/:title", jwtAuth, loadUser, function (req, res) {


//     let user = req.user
//     console.log(user)
//     var myurl = "https://www.goodreads.com/search/index.xml"
//     //my goodReads key
//     var key = "u357GGD3r1AuoeoFpQz2Q"
//     axios.get(myurl, {
//         params: {
//             q: req.params.title,
//             key,
//         }
//     })
//         .then(function (data) {
//             parseString(data.data, function (err, result) {
//                 // console.log(result)
//                 // res.send(result)


//             });

//         })
//         .catch(function (error) {

//             res.send(error);
//         });
// })

router.get("/author/:name", function (request, response) {
    var url = "https://www.goodreads.com/api/author_url/"
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
                var param = result.GoodreadsResponse.author[0].$.id
                const url = "http://localhost:8080/authorID/" + param
                axios.get(url).
                    then(function (result) {
                        response.send(result.data)
                    }).catch(function (error) {
                        response.send(error);
                    })
            });

        })
        .catch(function (error) {
            console.log(error);
            response.send(error);
        });
})

router.get("/authorID/:id", function (request, response) {
    var url = "https://www.goodreads.com/author/show/"
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


router.get("/currentlyReading", jwtAuth, function (req, res){
    let user = req.user
    console.log("hello")
    res.send(user.currentlyReading)
})

router.get("/currentlyReading/:title", jwtAuth, loadUser, function (req, res){

    console.log("Here")
    let user = req.user
    var myurl = "https://www.goodreads.com/search/index.xml"
    //my goodReads key
    var key = "u357GGD3r1AuoeoFpQz2Q"
    axios.get(myurl, {
        params: {
            q: req.params.title,
            key,
        }
    })
        .then(function (data) {
            parseString(data.data, function (err, result) {
  
                const parsed = result.GoodreadsResponse.search[0].results[0].work[0].best_book[0]

                books.create({
                    author: parsed.author[0].name[0],
                    title: parsed.title[0],
                    imageSrc: parsed.image_url[0]
                })
                .then(
                    function (book) {
                        
                        user.currentlyReading = book;
                        user.save()
                        .then(
                            res.send(book)
                        )
                    }
                )

            });

        })
        .catch(function (error) {

            res.send(error);
        });
})
module.exports = { router };
