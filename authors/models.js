const mongoose = require('mongoose');

const authorsSchema = mongoose.Schema({
  name: {type: String, required: true},
  about: {type: String, required: true},
  imageSrc: {type: String, required: true},
  largeImageSrc: {type: String},
  born: {type: String},
  died: {type: String},
  hometown: {type: String},
  books: {
    type: Array,
    'default': []
  }

});

authorsSchema.methods.apiRepr = function() {

  return {
    name: this.name,
  };
}

const authors = mongoose.model('Authors', authorsSchema);
module.exports = {authors};