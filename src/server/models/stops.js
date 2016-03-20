var mongoose = require('mongoose');

var schema = {
    STATION_ID: Number,
    TYP: String,
    DIVA: Number,
    NAME: String,
    MUNICIPALITY: String,
    MUNICIPALITY_ID: Number,
    WGS84_LAT: Number,
    WGS84_LON: Number,
    STAND: Number
};

var Stops = mongoose.model("Stops", schema);

module.exports = Stops;