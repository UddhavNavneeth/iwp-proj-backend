const {mongoose} = require("../db/mongoose");

let PostSchema = mongoose.Schema({
    message: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: String,
        required: true,
        trim: true
    },
    likes: {
        type: Number,
        trim: true
    }
})

let Post = mongoose.model('Post', PostSchema);

module.exports = {Post};