
(function(){

    angular
        .module("app.map", [])
        .controller("mapController", mapController);

    function mapController($scope,$http){


        $scope.map = {};

        $scope.stops = [];
        $scope.platforms = [];
        $scope.lines = [];
        $scope.interruptions = [];
        $scope.arrivals = [];

        $scope.car2go = [];
        $scope.citybike = [];

        var markers = [];
        var polylines = [];
        var polygons = [];



        var popup = L.popup();

        var LeafIcon = L.Icon.extend({
            options: {
                //shadowUrl: 'leaf-shadow.png',
                iconSize:     [10, 10],
                //shadowSize:   [50, 64],
                iconAnchor:   [5, 5],
                //shadowAnchor: [4, 62],
                popupAnchor:  [5, 5]
            }
        });
        var greenIcon = new LeafIcon({iconUrl: './images/green-icon.png'}),
            redIcon = new LeafIcon({iconUrl: './images/red-icon.png'});

        geometries.icons = [greenIcon, redIcon];






        //intitializiton///////////////////////////////////////////////////////////////////////////////////////////

        $scope.map.initMap = function(){



            map.setView([48.200, 16.366], 13);

            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png?{foo}', {
                foo: 'bar',
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                maxZoom: 18
            }).addTo(map);

        };

        $scope.map.locateUser = function(){
            var onLocationFound = function(e) {
                var radius = e.accuracy / 2;
                L.marker(e.latlng).addTo(map)
                    .bindPopup("You are within " + radius + " meters from this point");//.openPopup();
                L.circle(e.latlng, radius).addTo(map);
            };
            var onLocationError = function (e) {
                alert(e.message);
            };
            map.locate({setView: true, maxZoom: 16}); //16
            map.on('locationfound', onLocationFound);
            map.on('locationerror', onLocationError);
        };



        //Creating/////////////////////////////////////////////////////////////////////////////////////////////
        $scope.map.addPoints = function(points){
            $scope.map.addMarkers(data.stops);
            $scope.map.addCircles(data.stops);
            $scope.map.addCircleMarkers(points);

        };


        $scope.map.addMarkers = function(points){

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

        $scope.map.addCircles = function(points){

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

        $scope.map.addCircleMarkers = function(points){

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






        //Events////////////////////////////////////////////////////////////////////////////////////////////////

        $scope.map.onMapClick = function(e){
            //alert("You clicked the map at " + e.latlng);
            popup
                .setLatLng(e.latlng)
                .setContent("You clicked the map at " + e.latlng.toString())
                .openOn(map);
        };




        //Removing /////////////////////////////////////////////////////////////////////////////////////////////

        $scope.map.deleteAllMarkers = function () {
            var numOfMarkers = markers.length;
            if (numOfMarkers > 0) {
                for (var i = 0; i < numOfMarkers; i++) {
                    map.removeLayer(markers[i]);
                }
            }
            markers = [];
        };


        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        $scope.map.initMap();
        $scope.map.locateUser();
        map.on('click', $scope.map.onMapClick);

    }
}());








