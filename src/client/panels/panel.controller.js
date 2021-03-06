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
          console.log(response.data);
      });
    };
    $scope.getInterruptions = function () {
      return $http.get('/api/getinterrupt')
        .then(function (response) {
          return response.data;
        })
    };

    $scope.showInterrupt = function(interrupt){

        if (typeof interrupt.relatedStops === "undefined"){}
        else{
            console.log(interrupt.relatedStops.length);
            $http.get("/api/getapifromrbls", {
                    params: {
                        rbls: interrupt.relatedStops
                    }
                })
                .then(function (response) {
                    $rootScope.map.addMarkersOfInterrupt(response.data.data.monitors);
               });
        }
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
            if (typeof response.data[0] === "undefined"){}
            else{
              $rootScope.map.addMarkersOfPlatforms(response.data[0].platforms);
            }
          }
        });
    };

    $scope.prepareListOfStops = function(list, multiple){
        var stoplist = [];
        console.log(list);
      for (var i = 0; i < list.length; i++){
        var output = {
          name: list[i].stop['NAME'],
          id: list[i].stop['STATION-ID'],
          delayed: 0,
          platforms: [],
            order: list[i].stop['ORDER']   //used for order in a line
        };

        for (var j = 0; j < list[i].platforms.length; j++){
          var platform = {
            id: list[i].platforms[j][0],
            coordinates: {},
            delayed: 0,
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
                if (departure.timeReal - departure.timePlanned >= 120000){
                  departure.delayed = 1;
                }
                if (departure.timeReal - departure.timePlanned >= 300000){
                  departure.delayed = 2;
                }
                if(departure.delayed > line.delayed){
                  line.delayed = departure.delayed;
                }
                line.departures.push(departure);
              }
                if(line.delayed > platform.delayed){
                    platform.delayed = line.delayed;
                }
              platform.lines.push(line);
            }
          }
            if(platform.delayed > output.delayed){
                output.delayed = platform.delayed;
            }
          output.platforms.push(platform);
        }
        stoplist.push(output);
      }
      $scope.sortStops(stoplist, multiple);
    };

    $scope.sortStops = function(stoplist, multiple){
        if (typeof stoplist[0]  === "undefined"){}
        else{
            if (typeof stoplist[0].order  === "undefined"){}
            else{
                $scope.listForLine = $scope.orderStopsOfLine(stoplist);    // used in LINES tab to show the stops of the line
            }
        }

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
      $scope.stopName = stopName;
      $scope.$parent.stopTabActive();
      $scope.showStop(stopName);
    };

    $scope.orderStopsOfLine = function(stopList){
        function compare(a,b) {
            if (a.order < b.order)
                return -1;
            else if (a.order > b.order)
                return 1;
            else
                return 0;
        }
        return stopList.sort(compare);
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

    //LINE FUNCTIONS////////////////////////////////////////////////////////////////////////////////////////////////////

    $scope.showLine = function(lineName){
      for(var i = 0; i < globallines.length;i++){
        if (lineName == globallines[i]['NAME_OF_LINE']){
          $scope.loadStopsOfLine(globallines[i]['LINE_ID']);
        }
      }
    };
    $scope.loadStopsOfLine = function(lineID){
      $http.get("/platforms/getStopsOfLine", {    //TODO: get it with platform info directly
          params: {
            lineID: lineID
          }
        })
        .then(function (response) {
          $scope.loadPlatformsOfStopsWithIDs($scope.sortPlatforms(response.data));
        });
    };

    $scope.sortPlatforms = function(platforms){
      function compare(a,b) {
        if (a.ORDER < b.ORDER)
          return -1;
        else if (a.ORDER > b.ORDER)
          return 1;
        else
          return 0;
      }
      return platforms.sort(compare);
    };

    $scope.loadPlatformsOfStopsWithIDs = function(platforms){
        var stops = $scope.prepareLineList(platforms);
        //console.log(stops);
        $rootScope.map.addHighlightStop(stops, "highlightStop");
        $scope.loadPlatformsOfStops(stops, true, false);

    };
    $scope.prepareLineList = function(platforms){
      var stops = [];
      for(var i = 0; i < platforms.length; i++){
        for (var j =0; j < globalstops.length; j++){
          if (platforms[i]['FK_STATION_ID'] == globalstops[j]['STATION-ID']){
              var stop = globalstops[j];
              stop['ORDER'] = platforms[i].ORDER;
              stops.push(stop);
              break;
          }
        }
      }
        console.log(stops);
      return stops;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //GET STOPS, LINES AND OTHER VITAL DATA////////////////////////////////////////////////////////////////////////

    $scope.loadData = function () {
      $scope.loadStops();
      $scope.loadLines();
      //$scope.loadCar2Go();
    };

    $scope.loadStops = function () {
      $scope.getStops()
        .then(function (response) {
          globalstops = response;
          $scope.createStopList(response);
          $rootScope.map.addPoints(response, "stop");
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
          $scope.createLineList(response);
          //console.log(globallines);
        });
    };
    $scope.createLineList = function(globallines){
      $scope.lineList = [];
      globallines.forEach(function(lineCurrent){
        $scope.lineList.push({
          id: lineCurrent['LINE_ID'],
          name: lineCurrent['NAME_OF_LINE']
        });
      });
      //console.log($scope.lineList);
    };

    $scope.loadCar2Go = function(){
      $http.get("/api/getCar2Go")
        .then(function (response) {
          globalcar2go = response.data.placemarks;
          $rootScope.map.showCar2Go(response.data.placemarks);
        });
    };


    $scope.loadData();

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  }
}());
