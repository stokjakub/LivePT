(function(){

	angular
		.module("app.panel", [])
		.controller("panelController",panelController)
		.directive("panelWidget", stopsWidget);



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

        $scope.loadApi = function(){
            $scope.getApi().then(function(response) {
                api = response;
                $scope.api = JSON.stringify(api);
            });
        };

        $scope.getApi = function(){
            return $http.get("/api/getapi")
                .then(function(response){
                    //console.log(response.data);
                    return response.data;
                })
        }








	}


	function stopsWidget(){
		var widget = {
			templateUrl: "./panels/panels.widget.html",
			restrict: "E",
			controller: function($scope){
				$scope.buyme = function(stops){
					console.log(stops);
				}
			}
		};

		return widget;
	}

}());
