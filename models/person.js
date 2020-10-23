const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const personSchema = new mongoose.Schema({
  name: { type: String, unique: true, minlength: 2 },
  number: { type: String, minlength: 8 }
});
personSchema.plugin(uniqueValidator);

personSchema.set('toJSON', {
  transform: (doc, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});
module.exports = mongoose.model('Person', personSchema);
