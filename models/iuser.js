const {mongoose} = require("../db/mongoose");
const bcrypt = require("bcryptjs");

let IuserSchema = mongoose.Schema({
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    gender: {
        type: String,
        required: true,
        trim: true
    },
    interests: {
        type: Array,
    },
    friends: {
        type: Array
    },
    posts: [{
      title: {
        type: String,
        trim: true
      },
      likes: {
        type: String,
        trim: true
      }
    }]
    
  });

  IuserSchema.methods.isCorrectPassword = function(password, callback){
    bcrypt.compare(password, this.password, function(err, same) {
      if (err) {
        callback(err);
      } else {
        callback(err, same);
      }
    });
  }

  let Iuser = mongoose.model('Iuser', IuserSchema);

  module.exports = {Iuser};