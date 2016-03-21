(function(){

	var stopsService = function($http){

		var getStops = function(){
            return $http.get("/api/stops")
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
		.factory("stopsService", stopsService);

}());
