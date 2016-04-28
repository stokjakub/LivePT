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
            $scope.getStops().then(function(response){
                if(typeof response === "undefined" || response.length == 0){
                    console.log("Didn't receive any data.")
                    console.log(response);
                }else{
                    $rootScope.map.addPoints(response);
                }
            }
            );
        };

        $scope.getStops = function(){
            return $http.get("/stops/getallstops")
                .then(function(response){
                    //data.stops = response.data;
                    //console.log(data);
                    return response.data;
                })
        };

        $scope.loadStopWithAPI = function(stopID){
            $http.get("/platforms/getstopplatforms")
                .then(function(response){
                    console.log(response.data);
                    $rootScope.map.addPointsFromPlatforms(response.data);
                });

            //$scope.getOneApi(rbl).then(function(response) {
            //    $scope.api = JSON.stringify(response);
            //    $scope.showPlatformArrivals(response);
            //    $scope.monitors = response.data.monitors;
            //});
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
                $scope.interruptions = response.data;
                console.log(response.data);
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
