const mongoose = require('mongoose');
const { Schema } = mongoose;

// TODO: ADD fields for if a person has a project they want help with and if they are willing to help with a project

const userSchema = new Schema({
  'email': { 'type': String, 'required': true },
  'username': { 'type': String, 'required': true },
  'githubURL': { 'type': String, 'required': true },
  'photoURL': String, // GitHub profile picture
  'linkedin': String, // OPTIONAL
  'city': String, // OPTIONAL
  'state': String // OPTIONAL
});

mongoose.model('user', userSchema);
