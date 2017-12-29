const express = require('express');
const app = express();
const axios = require('axios')
const parseString = require('xml2js').parseString
const PORT = process.env.PORT || 8080;

const cors = require('cors');
const { CLIENT_ORIGIN } = require('./config');

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);

app.get("/books/:title", function (request, response) {
    var myurl = "https://www.goodreads.com/search/index.xml"
    //my goodReads key
    var key = "u357GGD3r1AuoeoFpQz2Q"
    axios.get(myurl, {
        params: {
            q: request.params.title,
            key,
        }
    })
        .then(function (data) {
            parseString(data.data, function (err, result) {
                response.send(result)
            });

        })
        .catch(function (error) {

            response.send(error);
        });
})

app.get("/author/:name", function(request, response){
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
    var param = result.GoodreadsResponse.author[0].$.id
    const url = "http://localhost:8080/authorID/" + param
    axios.get(url).
    then(function (result){    
        response.send(result.data)
    }).catch(function (error){
        response.send(error);
    })
});
    
  })
  .catch(function (error) {
    console.log(error);
    response.send(error);
  });
})

app.get("/authorID/:id", function(request, response){
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



app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = { app };