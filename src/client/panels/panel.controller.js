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

    $rootScope.assignLocation = function (list) {
      $scope.locationname = list.toponymName + ", "+list.adminName1+ ", "+list.countryName;
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
        //$rootScope.map.deleteAllMarkers();
        $rootScope.map.deleteAllHighlights();
        $rootScope.map.addPoints(response, "highlight");
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


    $scope.zoomToPlatform = function (platform) {
      $rootScope.map.locateToPoint([platform.coordinates.lat, platform.coordinates.lng]);
      var list = [];
      list.push(platform.coordinates);
      //$rootScope.map.addHighlights(list);

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
    $scope.listLocationStops = function(){
      $rootScope.map.locateUser();
    };
    $scope.listMapStops = function(){
      var coordinates = $rootScope.map.getProperties()[1];
      $rootScope.map.findClosestStops(coordinates);

    };

    $rootScope.listClosestStops = function (closestStops) {
      $scope.loadPlatformsOfStops(closestStops, true, false);
    };

    $scope.loadPlatformsOfStops = function (closestStops, multiple, draw) {
      $http.get("/platforms/getMultipleStopsPlatforms", {
          params: {
            stops: closestStops
          }
        })
        .then(function (response) {
          $scope.prepareListOfStops(response.data, multiple);
          if (draw){
            $rootScope.map.deleteAllPlatforms();
            $rootScope.map.addMarkersOfPlatforms(response.data[0].platforms);
          }
        });
    };

    $scope.prepareListOfStops = function(list, multiple){
      var stoplist = [];
      for (var i = 0; i < list.length; i++){
        var output = {
          name: list[i].stop['NAME'],
          id: list[i].stop['STATION-ID'],
          platforms: []
        };

        for (var j = 0; j < list[i].platforms.length; j++){
          var platform = {
            id: list[i].platforms[j][0],
            coordinates: {},
            lines: []
          };
          if (typeof list[i].platforms[j][1].data === "undefined")
          {}
          else if (typeof list[i].platforms[j][1].data.monitors[0] === "undefined"){
          }else{
            platform.coordinates = {
              lat: list[i].platforms[j][1].data.monitors[0].locationStop.geometry.coordinates[0],
              lng: list[i].platforms[j][1].data.monitors[0].locationStop.geometry.coordinates[1]
            };
            for (var k = 0; k < list[i].platforms[j][1].data.monitors[0].lines.length; k++){
              var line = {
                name: list[i].platforms[j][1].data.monitors[0].lines[k].name,
                direction: list[i].platforms[j][1].data.monitors[0].lines[k].towards,
                type: "",
                delayed: 0,
                departures: []
              };
              var type = "";
              if(list[i].platforms[j][1].data.monitors[0].lines[k].name.slice(-1)=="A"){
                type = "bus";
              }else if (list[i].platforms[j][1].data.monitors[0].lines[k].name.substring(0,1) == "U"){
                type = "metro"
              }else{
                type = "tram";
              }                                                                                                                         //TODO add metro
              line.type = type;

              for (var l = 0; l < list[i].platforms[j][1].data.monitors[0].lines[k].departures.departure.length; l++){
                var departure = {
                  countdown: list[i].platforms[j][1].data.monitors[0].lines[k].departures.departure[l].departureTime.countdown,
                  timePlanned: new Date(list[i].platforms[j][1].data.monitors[0].lines[k].departures.departure[l].departureTime.timePlanned),
                  timeReal: new Date(list[i].platforms[j][1].data.monitors[0].lines[k].departures.departure[l].departureTime.timeReal),
                  delayed: 0
                };
                if (departure.timeReal - departure.timePlanned >= 60000){
                  departure.delayed = 1;
                }
                if (departure.timeReal - departure.timePlanned >= 120000){
                  departure.delayed = 2;
                }
                if(departure.delayed > line.delayed){
                  line.delayed = departure.delayed;
                }
                line.departures.push(departure);
              }

              platform.lines.push(line);
            }
          }
          output.platforms.push(platform);
        }
        stoplist.push(output);
      }
      $scope.sortStops(stoplist, multiple);
    };

    $scope.sortStops = function(stoplist, multiple){
      $scope.filter = ["bus", "tram", "metro"];
      if (multiple){
        $scope.lists = [[],[],[]];
      }else{
        $scope.stationList = [[],[],[]];
      }

      for(var i = 0; i < stoplist.length; i++){
        var modes = {
          bus: false,
          tram: false,
          metro: false
        };
        for (var j = 0; j < stoplist[i].platforms.length;j++){
          for (var k = 0; k <stoplist[i].platforms[j].lines.length; k++){
            var line = stoplist[i].platforms[j].lines[k];
            if (line.type == "bus"){
              modes.bus = true;
            }else if (line.type == "tram"){
              modes.tram = true;
            }else if (line.type == "metro"){
              modes.metro = true;
            }
          }
        }
        if (multiple) {
          if (modes.bus == true)$scope.lists[0].push(stoplist[i]);
          if (modes.tram == true)$scope.lists[1].push(stoplist[i]);
          if (modes.metro == true)$scope.lists[2].push(stoplist[i]);
        }else{
          if (modes.bus == true)$scope.stationList[0].push(stoplist[i]);
          if (modes.tram == true)$scope.stationList[1].push(stoplist[i]);
          if (modes.metro == true)$scope.stationList[2].push(stoplist[i]);
        }
      }
    };
    $rootScope.redirectToStop = function(stopName){
      $scope.redirectToStop(stopName);
    };
    $scope.redirectToStop = function (stopName){
      $scope.$parent.stopTabActive();
      $scope.showStop(stopName);
    };
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //STATIONS FUNCTIONS///////////////////////////////////////////////////////////////////////////////////////////////

    $scope.showStop = function(stopName){
      for(var i = 0; i < globalstops.length;i++){
        if (stopName == globalstops[i]['NAME']){
          //$scope.loadStopWithAPI(globalstops[i]['STATION-ID']);
          var coordinates = [globalstops[i]['WGS84_LON'],globalstops[i]['WGS84_LAT']];
          $rootScope.map.locateToPoint(coordinates);
          $scope.loadPlatformsOfStops([globalstops[i]], false, true); // stops, multiple, draw platfroms

          break;
        }
      }
    };


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //GET STOPS, LINES AND OTHER VITAL DATA////////////////////////////////////////////////////////////////////////

    $scope.loadData = function () {
      $scope.loadStops();
      $scope.loadLines();
    };
    $scope.loadStops = function () {
      $scope.getStops()
        .then(function (response) {
          globalstops = response;
          $scope.createStopList(globalstops);
          $rootScope.map.addPoints(globalstops, "stop");
          //console.log(globalstops);
        });
    };
    $scope.createStopList = function(globalstops){
      $scope.stopList = [];
      globalstops.forEach(function(stopCurrent){
        $scope.stopList.push({
          id: stopCurrent['STATION-ID'],
          name: stopCurrent['NAME']
        });
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
