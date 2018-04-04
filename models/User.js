const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  'email': { 'type': String, 'required': true },
  'username': { 'type': String, 'required': true },
  'github': { 'type': String, 'required': true },
  'linkedin': String, // OPTIONAL
  'city': String, // OPTIONAL
  'state': String // OPTIONAL
});

mongoose.model('user', userSchema);
