(function() {
    'use strict';

    angular
        .module('Main', [
            'Main.panels',
            'Main.map'
            ]
        );
}());


//Global variables

var data = {};
var geometries = {};
map = L.map('map');