(function(){

	angular
		.module("Main.panels", [])
		.controller("panel_1Controller", panel_1Controller)
		.directive("panel_1Widget", stopsWidget);

	function panel_1Controller($scope, panel_1Service){
		
		var modelStops = function(data){
			$scope.stops = data;
		};

        panel_1Service.getStops()
			.then(modelStops);
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
