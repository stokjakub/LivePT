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

      $scope.stoplist = closestStops;

      //$scope.loadPlatformsOfStops(closestStops);


    };

    $scope.loadPlatformsOfStops = function (closestStops) {
      $http.get("/platforms/getMultipleStopsPlatforms", {
          params: {
            stops: closestStops
          }
        })
        .then(function (response) {
          console.log(response);
        });
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
