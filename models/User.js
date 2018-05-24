const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  'email': { 'type': String, 'required': true },
  'username': { 'type': String, 'required': true },
  'githubURL': { 'type': String, 'required': true },
  'photoURL': String, // GitHub profile picture
  'linkedin': String,
  'city': String,
  'state': String,
  'work': {
    'company': String,
    'title': String,
    'location': {
      'state': String,
      'city': String
    }
  },
  'education': {
    'Udemy': [{ // completed courses only
      'instructors': [String], 'title': String, 'url': String
    }],
    'Udacity': [String] // Nanodegree names
    // No need to worry about irrelevant stuff like college
  },
  'project': {
    'name': String,
    'site': String, // Probably Github Repo
    'skills': [ // Skills that the project needs
      String // General, Back End, Front End, etc.
    ],
    'technologies': [String] // What the project does/will use
    // Ex. ['MongoDB', 'Express', 'React', 'Node', 'AWS']
  },
  'available': { 'type': Boolean, 'default': false } // to work on a project
});

mongoose.model('user', userSchema);
