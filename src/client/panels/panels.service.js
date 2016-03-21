(function(){

	var panel_1Service = function($http){

		var getStops = function(){
            return $http.get("get_all_stops")
                .then(function(response){
                    console.log(response.data);
                    return response.data;
                })
        };

        return {
			getStops: getStops
		}

	};

	angular
		.module("Main")
		.factory("panel_1Service", panel_1Service);

}());
