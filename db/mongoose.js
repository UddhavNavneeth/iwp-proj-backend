const mongoose = require('mongoose');

mongoose.Promise = global.Promise; // -----?-----
let mongoUri = 'mongodb://UddhavNavneeth:Uddhav\'sg8@ds012188.mlab.com:12188/iwp';
mongoose.connect(mongoUri, function(err) {
    if (err) {
        throw err;
    } else {
        console.log(`Successfully connected to mlab`);
    }
});

module.exports = { mongoose };