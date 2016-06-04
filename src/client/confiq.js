var globaldata = {};
var globalstops = [];
var globallines = [];
var geometries = {};
var api = {};
map = L.map('map');

// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});
