'use-strict';

/**
 * The adress of the user
 */
var userAdress;

/**
 * Checks user input to search places around
 * the address matching the given input
 */
function searchLocations() {
    var address = document.getElementById("addressInput").value;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({address: address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var position = results[0].geometry.location;
            userAdress = address;
            searchLocationsNear(position);
            addUserMarker(position);
        } else {
            alert(address + ' not found');
        }
    });
}

/**
 * Searches locations near the given adress
 * @param center the center point for the research
 */
function searchLocationsNear(center) {
    clearLocations();
    var radius = document.getElementById('radiusSelect').value;
    retrieveNearLocations(locationsData, center, radius, function(nearLocations) {
        addLocations(nearLocations);
        locationSelect.style.visibility = "visible";
        locationSelect.onchange = function() {
            var markerNum = locationSelect.options[locationSelect.selectedIndex].value;
            google.maps.event.trigger(markers[markerNum], 'click');
        };
    });
}

/**
 * Retrieves the locations that are near the center using the data
 * @param data the locations searched through
 * @param center the center point of the research
 * @param radius the radius limitation for the research
 * @return {Array} the locations
 */
function retrieveNearLocations(data, center, radius, callback) {
    var near = [];
    var destinations = [];

    for(var i = 0; i < data.locations.length; i++) {
        var location = data.locations[i];
        destinations.push(new google.maps.LatLng(location.lat, location.lng));
    }

    var distanceService = new google.maps.DistanceMatrixService();
    distanceService.getDistanceMatrix(
        {
            origins: [center],
            destinations: destinations,
            travelMode: 'DRIVING'
        },
        function(response, status) {
            if (status == 'OK') {
                var results = response.rows[0].elements;
                for(i = 0; i < results.length; i++) {
                    var element = results[i];
                    var distance = element.distance.value;
                    if(distance < radius * 1000) {
                        data.locations[i].distance = distance;
                        near.push(data.locations[i]);
                    }
                }

                callback(near);
            }
            else {
                console.log("failed to calculate distances for center : " + center);
            }
        }
    );
}