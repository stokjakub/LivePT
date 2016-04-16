(function(){

	angular
		.module("app.panel", [])
		.controller("panelController",panelController);



	function panelController($rootScope, $scope, $http){

        $rootScope.panel = {};
        $scope.panel = {};

        $scope.stops = [];
        $scope.platforms = [];
        $scope.lines = [];
        $scope.interruptions = [];
        $scope.arrivals = [];

        $scope.car2go = [];
        $scope.citybike = [];








        $scope.loadStopsToMap = function(){
            $scope.getStops().then($rootScope.map.addPoints);
        };

        $scope.getStops = function(){
            return $http.get("/stops/getallstops")
                .then(function(response){
                    //data.stops = response.data;
                    //console.log(data);
                    return response.data;
                })
        };

        $scope.loadApi = function(rbl){
            /*
            $scope.getApi().then(function(response) {
                $scope.api = JSON.stringify(response);
            });
            */
            $scope.getOneApi(rbl).then(function(response) {
                $scope.api = JSON.stringify(response);
                $scope.showPlatformArrivals(response);
                $scope.monitors = response.data.monitors;
            });
        };

        $scope.getApi = function(){
            return $http.get("/api/getapi")
                .then(function(response){
                    //console.log(response.data);
                    return response.data;
                })
        };
        $scope.getOneApi = function(rbl) {
            return $http.get('/api/getoneapi', {
                params: {
                    rbl: rbl
                }})
                .then(function (response) {
                    return response.data;
                })
        };

        $scope.showPlatformArrivals = function(response){
            var data = response.data;
            var monitors = data.monitors;
            $rootScope.map.addPointsFromApi(monitors[0]);
            for (var i = 0; i < monitors.length; i++){
                console.log(monitors[i]);
                //$rootScope.map.addPointsFromApi(monitors[i]);
            }
        };


        $scope.loadInterrupt = function(){
            $scope.getInterruptions().then(function(response){
                $scope.interruptions = response;


            });
        };

        $scope.getInterruptions = function(){
            return $http.get('/api/getinterrupt')
                .then(function (response) {
                    return response.data;
                })
        };

	}
}());
