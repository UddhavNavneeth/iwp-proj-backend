const {mongoose} = require("../db/mongoose");
const bcrypt = require("bcryptjs");

let UserSchema = mongoose.Schema({
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
    }
    
  });

  UserSchema.methods.isCorrectPassword = function(password, callback){
    bcrypt.compare(password, this.password, function(err, same) {
      if (err) {
        callback(err);
      } else {
        callback(err, same);
      }
    });
  }


  // UserSchema.pre('save', function(next) {
  //     if (this.isModified('password')) {
  //       bcrypt.genSalt(10, (err, salt) => {
  //           bcrypt.hash(this.password, salt, (err, hash) => {
  //               this.password = hash;
  //               next();
  //           });
  //       });
  //     }
  // })

  let User = mongoose.model('User', UserSchema);

  module.exports = {User};