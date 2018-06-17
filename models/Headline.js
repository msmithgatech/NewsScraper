var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var headlineSchema = new Schema({
    topic: {
        type: String,
        required: true,
        unique: true
    },
    pix: {
        type: String,
        required: true
    },
    date: String,
    saved: {
        type: Boolean,
        default: false
    }

});

var Headline = mongoose.model("Headline", headlineSchema);

module.exports = Headline;