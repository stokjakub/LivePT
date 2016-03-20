(function(){

	angular
		.module("Main.panel_1", [])
		.controller("panel_1Controller", panel_1Controller)
		.directive("panel_1Widget", panel_1Widget);

	function panel_1Controller($scope, panel_1Service){
		
		var modelStops = function(data){
			$scope.stops = data;
		};

		stopsService.getStops()
			.then(modelStops);
	}

	function panel_1Widget(){
		var widget = {
			templateUrl: "./stops/panel_1.html",
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
