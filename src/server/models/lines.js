var mongoose = require('mongoose');

var schema = {
    LINE_ID: Number,
    NAME_OF_LINE: String,
    ORDER: Number,
    REALTIME: Number,
    MEANS_OF_TRANSPORT: String,
    STAND: Number
};

var Lines = mongoose.model("Lines", schema);

module.exports = Lines;