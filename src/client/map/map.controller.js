
(function(){

    angular
        .module("app.map", [])
        .controller("mapController", mapController);

    function mapController($rootScope,$scope,$http){


        $rootScope.map = {}; //for functions used in other controllers
        $scope.map = {}; //for functions used only in this controller

        var geometries = {
          markers: [],
          stops: [],
          platforms: [],
          highlights: [],
          highlightStops: [],
          car2go: []
        };

        $scope.arrivals = [];
        $scope.location = [];


        $scope.car2go = [];
        $scope.citybike = [];

        $scope.markerColor = {
            platform: "blue",
            highlight: "#FFFF00", //yellow
            highlightStop: "#FFFF00",
            car2go: "#01DF01"
          };

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
        $rootScope.map.locateUser = function(){
            var onLocationFound = function(e) {
                $scope.removeUserLocation();
                $scope.storeLocation(e.latlng);
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


        $scope.storeLocation = function(latlng){
          $rootScope.map.findClosestStops(latlng);
          $scope.getGeocode(latlng.lat, latlng.lng)
            .then(function(response){
              //console.log(response.geonames[0]);
              $rootScope.assignLocation(response.geonames[0]);
            });
        };

        $scope.getGeocode = function(lat, lng) {
          return $http.get('/api/reversegeocode', {
              params: {
                lat: lat,
                lng: lng
              }})
            .then(function (response) {

              return response.data;
            })
        };
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //CLOSEST STOPS SHOW///////////////////////////////////////////////////////////////////////////////////////////////////////////

        $rootScope.map.findClosestStops = function(latlng){

            var diameter_lat = 0.004;
            var diameter_lng = 0.008;
            var lat = latlng.lat;
            var lng = latlng.lng;
            var closestStops = [];
            for (var i = 0; i < globalstops.length; i++) {
              if (globalstops[i].WGS84_LAT < (lat + diameter_lat) && globalstops[i].WGS84_LAT > (lat - diameter_lat)
                && globalstops[i].WGS84_LON < (lng + diameter_lng) && globalstops[i].WGS84_LON > (lng - diameter_lng)) {
                closestStops.push(globalstops[i]);
              }
            }
            if (closestStops.length > 0){
              $scope.map.deleteAllHighlightStops();
              $rootScope.map.addPoints(closestStops,"highlightStop");
              $rootScope.listClosestStops(closestStops);
            }


        };

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


        $rootScope.map.addPoints = function(points, type){



            for (var i = 0; i < points.length; i++) {
              if (typeof points[i].color === "undefined"){
                points[i].color = "red";
              }
              if (typeof points[i]['STATION-ID'] === "undefined"){
                points[i]['STATION-ID'] = -1;
              }
              if (typeof points[i].NAME == "undefined"){
                points[i].NAME = "...";
              }
              if (type == "highlight"){
                points[i].color = $scope.markerColor.highlight;
              }else if (type == "platform"){
                points[i].color = $scope.markerColor.platform;
              }else if (type == "highlightStop"){
                points[i].color = $scope.markerColor.highlightStop;
              }

              var circleMarker = new L.circleMarker([points[i].WGS84_LAT, points[i].WGS84_LON],
                {
                    color: points[i].color,
                    fillColor: points[i].color,
                    fillOpacity: 0.5,
                    stopID: points[i]['STATION-ID'],
                    name: points[i].NAME
                })
                .setRadius(10)
                //.bindPopup(points[i].NAME)
                .on('click', function(e) {
                  if (type == "stop" || type == "highlightStop"){
                    $rootScope.redirectToStop(e.target.options.name);
                  }
                })
                .addTo(map);
              if (type == "platform") {
                geometries.platforms.push(circleMarker);
              }else if (type == "highlight") {
                geometries.highlights.push(circleMarker);
              }else if (type == "highlightStop") {
                geometries.highlightStops.push(circleMarker);
              }else if (type == "stop"){
                geometries.stops.push(circleMarker);
              }else{
                geometries.markers.push(circleMarker);
              }
            }
        };
        $rootScope.map.addMarkersOfPlatforms = function(data){
          var points = [];

          for (var i = 0; i < data.length; i++){
            if (typeof data[i][1].data == "undefined") {
            }else if (typeof data[i][1].data.monitors[0] == "undefined"){
            }else{
              var point = {
                color: $scope.markerColor.platform,
                NAME: "...",
                WGS84_LAT: data[i][1].data.monitors[0].locationStop.geometry.coordinates[1],
                WGS84_LON: data[i][1].data.monitors[0].locationStop.geometry.coordinates[0]
              };
              points.push(point);
            }
          }
          $rootScope.map.addPoints(points, "platform");

        };

        $rootScope.map.addHighlights = function(listOfCoordinates){
          //$rootScope.map.deleteAllHighlights();
          var points = [];
          for (var i = 0; i < listOfCoordinates.length; i++){

            var point = {
              color: $scope.markerColor.highlight,
              NAME: "Highlight",
              WGS84_LAT: listOfCoordinates[i].lat,
              WGS84_LON: listOfCoordinates[i].lng
            };
            points.push(point);

          }
          $rootScope.map.addPoints(points, "highlight");
        };

        $rootScope.map.addHighlightStop = function(stops, type){
            $scope.map.deleteAllHighlightStops();
            $rootScope.map.addPoints(stops, type);
        };


        $rootScope.map.showCar2Go = function (placemarks){

          if (geometries.car2go.length > 0){
            $scope.map.deleteAllCar2Go();
          }else{
            var points = [];
            for (var i = 0; i < placemarks.length; i++){
              var popup = "<dl><dt>Address</dt>"
                + "<dd>" + placemarks[i].address + "</dd>"
                + "<dt>Interior</dt>"
                + "<dd>" + placemarks[i].interior + "</dd>"
                + "<dt>Exterior</dt>"
                + "<dd>" + placemarks[i].exterior + "</dd>"
                + "<dt>Fuel</dt>"
                + "<dd>" + placemarks[i].fuel + "</dd>"
                + "<dt>Name</dt>"
                + "<dd>" + placemarks[i].name + "</dd>" + "</dl>";
              var circleMarker = new L.circleMarker([placemarks[i].coordinates[1], placemarks[i].coordinates[0]],
                {
                  color: $scope.markerColor.car2go,
                  fillColor: $scope.markerColor.car2go,
                  fillOpacity: 0.5
                })
                .setRadius(10)
                .bindPopup(popup)
                .addTo(map);
              geometries.car2go.push(circleMarker);
            }
          }



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
        $scope.map.deleteAllCar2Go = function () {
          var num = geometries.car2go.length;
          if (num > 0) {
            for (var i = 0; i < num; i++) {
              map.removeLayer(geometries.car2go[i]);
            }
          }
          geometries.car2go = [];
        };
        $rootScope.map.deleteAllPlatforms = function () {
          var num = geometries.platforms.length;
          if (num > 0) {
            for (var i = 0; i < num; i++) {
              map.removeLayer(geometries.platforms[i]);
            }
          }
          geometries.platforms = [];
        };
        $rootScope.map.deleteAllHighlights = function () {
          var num = geometries.highlights.length;
          if (num > 0) {
            for (var i = 0; i < num; i++) {
              map.removeLayer(geometries.highlights[i]);
            }
          }
          geometries.platforms = [];
        };
        $scope.map.deleteAllHighlightStops = function () {
          var num = geometries.highlightStops.length;
          if (num > 0) {
            for (var i = 0; i < num; i++) {
              map.removeLayer(geometries.highlightStops[i]);
            }
          }
          geometries.platforms = [];
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








