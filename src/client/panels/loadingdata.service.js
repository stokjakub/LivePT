(function(){

	var loadingDataService = function($http){

		var getStops = function(){
            return $http.get("/get_all_stops")
                .then(function(response){
                    data.stops = response.data;
                    console.log(data);
                    return response.data;
                })
        };

        return {
			getStops: getStops
		}

	};

	angular
		.module("Main")
		.factory("loadingDataService", loadingDataService);

}());
