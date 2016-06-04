(function(){

	angular
		.module("app.panel", [])
		.controller("panelController",panelController);



	function panelController($rootScope, $scope, $http) {

    $rootScope.panel = {};
    $scope.panel = {};

    $scope.stops = [];
    $scope.platforms = [];
    $scope.lines = [];
    $scope.interruptions = [];
    $scope.arrivals = [];

    $scope.car2go = [];
    $scope.citybike = [];


    $rootScope.loadStopActive = false;

    $rootScope.assignLocationName = function (name) {
      console.log(name);
      $scope.locationname = name;
    };


    //LOAD APIS//////////////////////////////////////////////////////////////////////////////////

    $scope.getStops = function () {
      return $http.get("/stops/getAllStops")
        .then(function (response) {
          return response.data;
        })
    };
    $scope.getLines = function () {
      return $http.get("/lines/getAllLines")
        .then(function (response) {
          return response.data;
        })
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    //LOADING STOPS IN AREA USING MAP STATE///////////////////////////////////////////////////////////////////////
    $scope.loadStopsInAreaToMap = function () {
      if ($rootScope.loadStopActive == false) {
        $rootScope.loadStopActive = true;
        $rootScope.loadStopsInArea();
      } else {
        $rootScope.map.deleteAllMarkers();
        $rootScope.loadStopActive = false;
      }
    };
    $rootScope.loadStopsInArea = function () {
      var coordinates, zoom;
      zoom = $rootScope.map.getProperties()[0];
      coordinates = $rootScope.map.getProperties()[1];

      $scope.getStopsInArea(coordinates, zoom).then(function (response) {
        $rootScope.map.addStops(response);
      });
    };
    $scope.getStopsInArea = function (coordinates, zoom) {
      return $http.get("/stops/getStopsInTheArea", {
          params: {
            coordinates: coordinates,
            zoom: zoom
          }
        })
        .then(function (response) {
          //data.stops = response.data;
          //console.log(data);
          return response.data;
        })
    };
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //LOAD APIS OF PLATFORMS OF A STOP/////////////////////////////////////////////////////////////////////////////
    $rootScope.showArrivalsAfterClickOnStopInMap = function (stopID) {
      $scope.loadStopWithAPI(stopID);
    };
    $scope.loadStopWithAPI = function (stopID) {
      $http.get("/platforms/getStopPlatformsArrivals", {
          params: {
            stopID: stopID
          }
        })
        .then(function (response) {
          $scope.stopApis = [];
          $scope.stopApis = response.data;
          console.log(response.data);
          //$rootScope.map.addPointsFromSetOfApi(response.data);  //not used - too much stuff in the map
        });
    };

    $scope.zoomToPlatform = function (rbl, coordinates) {
      $rootScope.map.locateToPoint(coordinates);
      $rootScope.map.addMarkerOfPlatform(coordinates);

    };

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //LOADING API VARIOIS WAYS/////////////////////////////////////////////////////////////////////////////////////
    $scope.getApi = function () {
      return $http.get("/api/getapi")
        .then(function (response) {
          //console.log(response.data);
          return response.data;
        })
    };
    $scope.getOneApi = function (rbl) {
      return $http.get('/api/getoneapi', {
          params: {
            rbl: rbl
          }
        })
        .then(function (response) {
          return response.data;
        })
    };
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //LOADING INTERRUPTIONS//////////////////////////////////////////////////////////////////////////////////////
    $scope.loadInterrupt = function () {
      $scope.getInterruptions().then(function (response) {
        $scope.interruptions = response.data;
      });
    };
    $scope.getInterruptions = function () {
      return $http.get('/api/getinterrupt')
        .then(function (response) {
          return response.data;
        })
    };
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //HOME PAGE FUNCTIONS///////////////////////////////////////////////////////////////////////////////////////

    $rootScope.listClosestStops = function (closestStops) {

      $scope.loadPlatformsOfStops(closestStops);


    };

    $scope.loadPlatformsOfStops = function (closestStops) {
      $http.get("/platforms/getMultipleStopsPlatforms", {
          params: {
            stops: closestStops
          }
        })
        .then(function (response) {

          $scope.prepareListOfStops(response.data);
          //console.log($scope.stoplist);
        });
    };

    $scope.prepareListOfStops = function(list){
      $scope.stoplist = [];

      for (var i = 0; i < list.length; i++){

        var output = {
          name: list[i].stop['NAME'],
          id: list[i].stop['STATION-ID'],
          platforms: []
        };

        for (var j = 0; j < list[i].platforms.length; j++){
          var platform = {
            id: list[i].platforms[j][0],
            lines: []
          };
          if (typeof list[i].platforms[j][1].data.monitors[0] === "undefined"){
          }else{
            for (var k = 0; k < list[i].platforms[j][1].data.monitors[0].lines.length; k++){
              var line = {
                name: list[i].platforms[j][1].data.monitors[0].lines[k].name,
                direction: list[i].platforms[j][1].data.monitors[0].lines[k].direction,
                type: "",
                departures: []
              };
              var type = "";
              if(list[i].platforms[j][1].data.monitors[0].lines[k].name.slice(-1)=="A"){
                type = "bus";
              }else{
                type = "tram"
              }                                                                                                                         //TODO add metro
              line.type = type;

              for (var l = 0; l < list[i].platforms[j][1].data.monitors[0].lines[k].departures.departure.length; l++){
                var departure = {
                  countdown: list[i].platforms[j][1].data.monitors[0].lines[k].departures.departure[l].departureTime.countdown,
                  timePlanned: list[i].platforms[j][1].data.monitors[0].lines[k].departures.departure[l].departureTime.timePlanned,
                  timeReal: list[i].platforms[j][1].data.monitors[0].lines[k].departures.departure[l].departureTime.timeReal
                };
                line.departures.push(departure);
              }
              platform.lines.push(line);
            }
          }
          output.platforms.push(platform);
        }

        $scope.stoplist= output;
        console.log(output);
      }

    };

    //GET STOPS, LINES AND OTHER VITAL DATA////////////////////////////////////////////////////////////////////////

    $scope.loadData = function () {
      $scope.loadStops();
      $scope.loadLines();
    };
    $scope.loadStops = function () {
      $scope.getStops()
        .then(function (response) {
          globalstops = response;
          //console.log(globalstops);
        });
    };
    $scope.loadLines = function () {
      $scope.getLines()
        .then(function (response) {
          globallines = response;
          //console.log(globallines);
        });
    };


    $scope.loadData();

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  }
}());
