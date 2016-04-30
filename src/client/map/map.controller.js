
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
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //CONFIGURATION/////////////////////////////////////////////////////////////////////////////////////////////
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

        var getRandomColor = function(){
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        };


        ////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
        $scope.map.initMap();
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //USER LOCALIZATION/////////////////////////////////////////////////////////////////////////////////////////
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
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //ZOOMING////////////////////////////////////////////////////////////////////////////////////////////////////

        $rootScope.map.locateToPoint = function(coordinates){
            var zoom = 18;
            map.setView([coordinates[1], coordinates[0]], zoom);
        };

        //GET PROPERTIES/////////////////////////////////////////////////////////////////////////////////////////////
        $rootScope.map.getProperties = function(){
            var zoom = map.getZoom();
            var coordinates = map.getCenter();
            return [zoom, coordinates];
        };
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //ADDING POINTS/////////////////////////////////////////////////////////////////////////////////////////////
        $rootScope.map.addPointsFromSetOfApi = function(data){
            var points = [];

            for (var i = 0; i < data.length; i++){
                var point = {
                    color: "random",
                    NAME: data[i][0],
                    WGS84_LAT: data[i][1].data.monitors[0].locationStop.geometry.coordinates[1],
                    WGS84_LON: data[i][1].data.monitors[0].locationStop.geometry.coordinates[0]
                };
                points.push(point);
            }

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
            for (var i = 0; i < data.data.monitors.length; i++){
                var platform = data.data.monitors[i];
                var point = {
                    color: "random",
                    NAME: platform[i].RBL_NUMMER,
                    WGS84_LAT: platform[i].STEIG_WGS84_LAT,
                    WGS84_LON: platform[i].STEIG_WGS84_LON
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
        $rootScope.map.addStops = function(points){
            var getColor = function(){
                if (typeof points[0].color === "undefined") return "red";  //"red"
                else return getRandomColor();
            };
            var color1 = getColor();
            var color2 = getColor();
            for (var i = 0; i < points.length; i++) {
                var circleMarker = new L.circleMarker([points[i].WGS84_LAT, points[i].WGS84_LON],
                    {
                        color: color1,
                        fillColor: color2,
                        fillOpacity: 0.5,
                        stopID: points[i]['STATION-ID']
                    })
                    .setRadius(10)
                    .bindPopup(points[i].NAME)
                    .on('click', function(e) {
                        $rootScope.showArrivalsAfterClickOnStopInMap(e.target.options.stopID)
                    })
                    .addTo(map);
                geometries.markers.push(circleMarker);
            }
        };

        $rootScope.map.addMarkerOfPlatform = function(coordinates){


            var marker = new L.marker([coordinates[1],coordinates],
                {
                    //icon: geometries.icons[1]
                })
                //.bindPopup(points[i].NAME)
                .addTo(map);
            geometries.markers.push(marker);
        };
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //REMOVING STUFF /////////////////////////////////////////////////////////////////////////////////////////////
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

        //Events////////////////////////////////////////////////////////////////////////////////////////////////
        map.on('click', function(e){

            if (1 < 2)
            {
                //$scope.map.onMapClick(e);
            }

        });

        map.on('moveend', function(e) {
            if ($rootScope.loadStopActive == true)
            {
                //$rootScope.map.deleteAllMarkers();
                //$rootScope.loadStopsInArea();
            }

        });


        $scope.map.onMapClick = function(e){
            //alert("You clicked the map at " + e.latlng);
            popup
                .setLatLng(e.latlng)
                .setContent("You clicked the map at " + e.latlng.toString())
                .openOn(map);
        };

    }
}());








