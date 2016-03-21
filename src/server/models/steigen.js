var mongoose = require('mongoose');

var schema = {
    STEIG_ID: Number,
    FK_LINE_ID: Number,
    FK_STATION_ID: Number,
    DIRECTION: String,
    ORDER: Number,
    RBL_NUMMER: Number,
    ZONE: Number,
    STEIG: String,
    STEIG_WGS84_LAT: Number,
    STEIG_WGS84_LON: Number,
    STAND: Number
};

var Steigen = mongoose.model("Steigen", schema);

module.exports = Steigen;