
(function(){

    angular
        .module("app.map", [])
        .controller("mapController", mapController);

    function mapController($rootScope,$scope,$http){


        $rootScope.map = {}; //for functions used in other controllers
        $scope.map = {}; //for functions used only in this controller

        $scope.stops = [];
        $scope.platforms = [];
        $scope.lines = [];
        $scope.interruptions = [];
        $scope.arrivals = [];
        $scope.location = [];

        $scope.car2go = [];
        $scope.citybike = [];


        geometries.markers = [];
        geometries.polylines = [];
        geometries.polygons = [];



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
                $scope.removeUserLocation();
                var radius = e.accuracy / 2;

                var marker = L.marker(e.latlng).addTo(map)
                    .bindPopup("You are within " + radius + " meters from this point");//.openPopup();
                var circle = L.circle(e.latlng, radius).addTo(map);
                $scope.location.push(marker);
                $scope.location.push(circle);
            };
            var onLocationError = function (e) {
                alert(e.message);
            };
            map.locate({setView: true, maxZoom: 16}); //16
            map.on('locationfound', onLocationFound);
            map.on('locationerror', onLocationError);
        };



        //Creating/////////////////////////////////////////////////////////////////////////////////////////////
        $rootScope.map.addPoints = function(points){
            //$scope.map.addMarkers(points);
            //$scope.map.addCircles(points);
            $scope.map.addCircleMarkers(points);
        };

        $rootScope.map.addPointsFromApi = function(data){
            var points = [];

            var point = {
                color: "random",
                NAME: data.locationStop.properties.title,
                WGS84_LAT: data.locationStop.geometry.coordinates[1],
                WGS84_LON: data.locationStop.geometry.coordinates[0],
            };
            points.push(point);
            $scope.map.addCircleMarkers(points);
        };

        $rootScope.map.addPointsFromPlatforms = function(data){
            var points = [];
            for (var i = 0; i < data.length; i++){
                var point = {
                    color: "random",
                    NAME: data[i].RBL_NUMMER,
                    WGS84_LAT: data[i].STEIG_WGS84_LAT,
                    WGS84_LON: data[i].STEIG_WGS84_LON
                };
                points.push(point);
            }

            $scope.map.addCircleMarkers(points);
        };
        /*
        $scope.map.addMarkers = function(points){

            for (var i = 0; i < points.length; i++) {

                var marker = new L.marker([points[i].WGS84_LAT,points[i].WGS84_LON],
                    {
                        icon: geometries.icons[1]
                    })
                    .bindPopup(points[i].NAME)
                    .addTo(map);
                geometries.markers.push(marker);

            }
            //console.log(geometries);
        };

        $scope.map.addCircles = function(points){


            for (var i = 0; i < points.length; i++) {

                var circle = new L.circle([points[i].WGS84_LAT,points[i].WGS84_LON], 50,
                    {
                        color: 'red',
                        fillColor: '#f03',
                        fillOpacity: 0.5
                    })
                    .bindPopup(points[i].NAME)
                    .addTo(map);
                geometries.markers.push(circle);

            }

        };
        */
        $scope.map.addCircleMarkers = function(points){
            var getColor = function(){
                if (typeof points[0].color === "undefined") return getRandomColor();  //"red"
                else return getRandomColor();
            };
            var color1 = getColor();
            var color2 = getColor();
            for (var i = 0; i < points.length; i++) {

                var circleMarker = new L.circleMarker([points[i].WGS84_LAT, points[i].WGS84_LON],
                    {
                        color: color1,
                        fillColor: color2,
                        fillOpacity: 0.5
                    })
                    .setRadius(10)
                    .bindPopup(points[i].NAME)
                    .addTo(map);
                geometries.markers.push(circleMarker);

            }
        };


        function getRandomColor() {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        //Events////////////////////////////////////////////////////////////////////////////////////////////////

        $scope.map.onMapClick = function(e){
            //alert("You clicked the map at " + e.latlng);
            popup
                .setLatLng(e.latlng)
                .setContent("You clicked the map at " + e.latlng.toString())
                .openOn(map);
        };




        //Removing /////////////////////////////////////////////////////////////////////////////////////////////

        $rootScope.map.deleteAllMarkers = function () {
            var numOfMarkers = geometries.markers.length;
            if (numOfMarkers > 0) {
                for (var i = 0; i < numOfMarkers; i++) {
                    map.removeLayer(geometries.markers[i]);
                }
            }
            geometries.markers = [];
        };

        $scope.removeUserLocation = function(){
            var numOfObjects = $scope.location.length;
            if (numOfObjects > 0) {
                for (var i = 0; i < numOfObjects; i++) {
                    map.removeLayer($scope.location[i]);
                }
            }
            $scope.location = [];
        };


        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        map.on('click', function(e){

            if (1 < 2)
            {
                $scope.map.onMapClick(e);
            }

        });



        $scope.map.initMap();
    }
}());








