(function(){

	angular
		.module("Main.stops", [])
		.controller("stopsController", stopsController)
		.directive("stopsWidget", stopsWidget);

	function stopsController($scope, stopsService){
		
		var modelStops = function(data){
			$scope.stops = data;
		};

		stopsService.getStops()
			.then(modelStops);
	}

	function stopsWidget(){
		var widget = {
			templateUrl: "./stops/stops.widget.html",
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
