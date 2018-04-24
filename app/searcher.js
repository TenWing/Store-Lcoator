'use-strict';

/**
 * The adress of the user
 * .address : textual
 * .position : lat lng object
 */
var userAddress = {};

/**
 * Checks user input to search places around
 * the address matching the given input
 */
function searchLocations() {
    // Searching triggers a UI reset
    resetUi();

    // Geocode user's address
    var address = document.getElementById("addressInput").value;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({address: address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {

            // Updates value of user's address
            var position = results[0].geometry.location;
            userAddress.address = address;
            userAddress.position = position;

            // Search all locations near
            searchLocationsNear(position);

            // Adds the marker for the user's address on map
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
    // Wipes all markers on map to add new ones
    clearLocations();
    var radius = document.getElementById('radiusSelect').value;
    retrieveNearLocations(locationsData, center, radius, function(nearLocations) {
        // Adds all the locations kept to the map after retrieving them
        addLocations(nearLocations);

        // Display the list of results in the select component
        locationSelect.style.visibility = "visible";

        // On selecting a value, fires click event to click the marker corresponding
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
 * @param callback fucntion called after all near locations have been found (gives them in parameter)
 * @return {Array} the locations
 */
function retrieveNearLocations(data, center, radius, callback) {
    var near = [];
    var destinations = [];

    // Converts all locations to google latlng objects
    for(var i = 0; i < data.locations.length; i++) {
        var location = data.locations[i];
        destinations.push(new google.maps.LatLng(location.lat, location.lng));
    }

    // Use of distance matrix to computes distances from user's address
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

                    // Keeps locations that are udner the radius threshold
                    if(distance < radius * 1000) {
                        data.locations[i].distance = distance;
                        near.push(data.locations[i]);
                    }
                }

                // We give all the filtered locations to the callback
                callback(near);
            }
            else {
                console.log("failed to calculate distances for center : " + center);
            }
        }
    );
}