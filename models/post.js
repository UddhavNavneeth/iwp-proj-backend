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
    }
})