(function(){

	angular
		.module("Main.panels", [])
		.controller("panel_1Controller", panel_1Controller)
		.directive("panel_1Widget", stopsWidget);










	function panel_1Controller($scope, loadingDataService, mapService){
		
		var modelStops = function(data){
			$scope.stops = data;
		};

        loadingDataService.getStops()
			.then(modelStops);


        $scope.loadStopsToMap = function(){
            //mapService.addMarkers(data.stops);
            mapService.addCircles(data.stops);

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
