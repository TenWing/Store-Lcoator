'use-strict';

/**
 * Checks user input to search places around
 * the address matching the given input
 */
function searchLocations() {
    var address = document.getElementById("addressInput").value;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({address: address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            searchLocationsNear(results[0].geometry.location);
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
    var nearLocations = retrieveNearLocations(locationsData, center, radius);
    addLocations(nearLocations);
    locationSelect.style.visibility = "visible";
    locationSelect.onchange = function() {
        var markerNum = locationSelect.options[locationSelect.selectedIndex].value;
        google.maps.event.trigger(markers[markerNum], 'click');
    };
}

/**
 * Computes distance between 2 points in lat long (degrees)
 * @param lat1 lat of point 1
 * @param lon1 lng of point 1
 * @param lat2 lat of point 2
 * @param lon2 olng of point 2
 * @return {number} the distance in meters
 */
function distanceBetween(lat1, lon1, lat2, lon2) {

    function radians(_degrees) {
        return _degrees * Math.PI / 180;
    }

    var R = 6371e3;
    var d1 = radians(lat1);
    var d2 = radians(lat2);
    var d3 = radians((lat2-lat1));
    var d4 = radians((lon2-lon1));

    var a = Math.sin(d3/2) * Math.sin(d3/2) +
        Math.cos(d1) * Math.cos(d2) *
        Math.sin(d4/2) * Math.sin(d4/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
}

/**
 * Retrieves the locations that are near the center using the data
 * @param data the locations searched through
 * @param center the center point of the research
 * @param radius the radius limitation for the research
 * @return {Array} the locations
 */
function retrieveNearLocations(data, center, radius) {
    var near = [];
    for(var i = 0; i < data.locations.length; i++) {
        var location = data.locations[i];
        var distance = distanceBetween(center.lat(), center.lng(), location.lat, location.lng) / 1000;
        if( distance < radius ) {
            location.distance = distance;
            near.push(location);
        }
    }
    return near;
}