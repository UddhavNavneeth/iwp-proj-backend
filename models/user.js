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

  // UserSchema.methods.isCorrectPassword = (password) => {
  //   // console.log(bcrypt.compare(password, this.password));
  //     return new Promise((resolve, reject) => {
  //     bcrypt.compare(password, this.password, (err, res) => {
  //         if (res) {
  //             resolve(this);
  //         } else {
  //             reject();
  //         }
  //     });
  //   });
  // }

  // UserSchema.methods.isCorrectPassword = (password) => {
  //   bcrypt.compare(password, this.password).then((res) =>  {
  //       return resolve(res);
  //   }).catch((e) => {
  //       return Promise.reject();
  //   });
  // }


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