(function(){

    var mapService = function($http){

        var addMarkers = function(points){

            geometries.markers = [];
            for (var i = 0; i < points.length; i++) {

                var marker = new L.marker([points[i].WGS84_LAT,points[i].WGS84_LON],
                        {
                            icon: geometries.icons[1]
                        })
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
                    {
                        color: 'red',
                        fillColor: '#f03',
                        fillOpacity: 0.5
                    })
                    .bindPopup(points[i].NAME)
                    .addTo(map);
                geometries.circles.push(circle);

            }
            console.log(geometries);
        };

        var addCircleMarkers = function(points){

            geometries.circleMarkers = [];
            for (var i = 0; i < points.length; i++) {

                var circleMarker = new L.circleMarker([points[i].WGS84_LAT,points[i].WGS84_LON],
                    {
                        color: 'red',
                        fillColor: '#f03',
                        fillOpacity: 0.5
                    })
                    .setRadius(5)
                    .bindPopup(points[i].NAME)
                    .addTo(map);
                geometries.circleMarkers.push(circleMarker);

            }
            console.log(geometries);
        };

        var deleteAllGeometries = function(){

        };































        return {
            addMarkers: addMarkers,
            addCircles: addCircles,
            addCircleMarkers: addCircleMarkers
        }

    };

    angular
        .module("Main")
        .factory("mapService", mapService);

}());
