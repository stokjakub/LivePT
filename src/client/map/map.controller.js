
(function(){

    angular
        .module("Main.map", [])
        .controller("mapController", mapController);

    function mapController($scope){

        var initMap = function(){
            var onLocationFound = function(e) {
                var radius = e.accuracy / 2;
                L.marker(e.latlng).addTo(map)
                    .bindPopup("You are within " + radius + " meters from this point");//.openPopup();
                L.circle(e.latlng, radius).addTo(map);
            };
            var onLocationError = function (e) {
                alert(e.message);
            };
            map.setView([48.200, 16.366], 13);
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar'}).addTo(map);
            map.locate({setView: true, maxZoom: 13}); //16

            map.on('locationfound', onLocationFound);
            map.on('locationerror', onLocationError);
        };
        initMap();








    }
}());








