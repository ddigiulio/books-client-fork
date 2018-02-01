const mongoose = require('mongoose');

const booksSchema = mongoose.Schema({
  title: {type: String, required: true},
  author: {type: String, required: true},
  imageSrc: {type: String, required: true},
  description: {type: String},
  rating: {type: Number},
  pubYear: {type: Number},
  pubMonth: {type: Number}

});

booksSchema.methods.apiRepr = function() {

  return {
    title:  this.title,
    author: this.author,

  
  };
}

const books = mongoose.model('Books', booksSchema);

module.exports = {books};
