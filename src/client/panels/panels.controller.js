(function(){

	angular
		.module("app.panels", [])
		.controller("panel_1Controller",panel_1Controller)
		.directive("panel_1Widget", stopsWidget);



	function panel_1Controller($scope, $http){






        $scope.loadStopsToMap = function(){
            $scope.getStops().then(Scopes.get('mapController').map.addPoints());
        };




        $scope.getStops = function(){
            return $http.get("/get_all_stops")
                .then(function(response){
                    data.stops = response.data;
                    console.log(data);
                    return response.data;
                })
        };










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
