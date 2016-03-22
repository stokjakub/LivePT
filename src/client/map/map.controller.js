
(function(){

    angular
        .module("Main.map", [])
        .controller("mapController", mapController);

    function mapController($scope){

        var initMap = function(){

            var grayscale = L.tileLayer(mapboxUrl, {id: 'MapID', attribution: mapboxAttribution}),
                streets   = L.tileLayer(mapboxUrl, {id: 'MapID', attribution: mapboxAttribution});


            map.setView([48.200, 16.366], 13);
            /*
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png?{foo}', {
                foo: 'bar',
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                maxZoom: 18
            }).addTo(map);
            */
            map({
                center: [39.73, -104.99],
                zoom: 10,
                layers: [grayscale, cities]
            });

            var baseMaps = {
                "Grayscale": grayscale,
                "Streets": streets
            };

            var overlayMaps = {
                "Cities": cities
            };

            L.control.layers(baseMaps, overlayMaps).addTo(map);

        };

        var locateUser = function(){
            var onLocationFound = function(e) {
                var radius = e.accuracy / 2;
                L.marker(e.latlng).addTo(map)
                    .bindPopup("You are within " + radius + " meters from this point");//.openPopup();
                L.circle(e.latlng, radius).addTo(map);
            };
            var onLocationError = function (e) {
                alert(e.message);
            };
            map.locate({setView: true, maxZoom: 13}); //16
            map.on('locationfound', onLocationFound);
            map.on('locationerror', onLocationError);
        };

        initMap();
        //locateUser();


        var popup = L.popup();

        function onMapClick(e) {
            //alert("You clicked the map at " + e.latlng);
            popup
                .setLatLng(e.latlng)
                .setContent("You clicked the map at " + e.latlng.toString())
                .openOn(map);
        }

        map.on('click', onMapClick);




        var LeafIcon = L.Icon.extend({
            options: {
                //shadowUrl: 'leaf-shadow.png',
                iconSize:     [10, 10],
                //shadowSize:   [50, 64],
                iconAnchor:   [5, 5],
                //shadowAnchor: [4, 62],
                popupAnchor:  [5, 5]
            }
        });
        var greenIcon = new LeafIcon({iconUrl: './images/green-icon.png'}),
            redIcon = new LeafIcon({iconUrl: './images/red-icon.png'});

        geometries.icons = [greenIcon, redIcon];







    }
}());








