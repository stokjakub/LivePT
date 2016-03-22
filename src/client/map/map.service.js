(function(){

    var mapService = function($http){

        var addMarkers = function(points){

            geometries.markers = [];
            for (var i = 0; i < points.length; i++) {

                var marker = new L.marker([points[i].WGS84_LAT,points[i].WGS84_LON])
                    .bindPopup(points[i].NAME)
                    .addTo(map);
                geometries.markers.push(marker);

            }
            console.log(geometries);
        };

        var addCircles = function(points){

            geometries.circles = [];
            for (var i = 0; i < points.length; i++) {

                var circle = new L.circle([points[i].WGS84_LAT,points[i].WGS84_LON], 50,
                    {color: 'red',
                    fillColor: '#f03',
                    fillOpacity: 0.5})
                    .bindPopup(points[i].NAME)
                    .addTo(map);
                geometries.circles.push(circle);

            }
            console.log(geometries);
        };

        return {
            addMarkers: addMarkers,
            addCircles: addCircles
        }

    };

    angular
        .module("Main")
        .factory("mapService", mapService);

}());
