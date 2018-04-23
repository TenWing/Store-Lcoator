'use-strict';

/**
 * The DOM element containing the research results
 */
var locationSelect;

/**
 * Resets all fields an displays all locations in the application
 * called the first time on arriving in the application
 */
function displayAllLocations() {
    clearLocations();
    addLocations(locationsData.locations);
}

/**
 * Adds a list of locations to the application
 * @param _locations the array of application
 */
function addLocations(_locations) {

    var bounds = new google.maps.LatLngBounds();

    for (var i = 0; i < _locations.length; i++) {
        var location = _locations[i];
        var name = location.name;
        var address = location.address;
        var distance = parseFloat(location.distance);
        var latlng = new google.maps.LatLng(
            parseFloat(location.lat),
            parseFloat(location.lng));

        createOption(name, distance, i);
        createMarker(latlng, name, address);
        bounds.extend(latlng);
    }

    map.fitBounds(bounds);
}


/**
 * Clears all markers indicating locations on the map
 */
function clearLocations() {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers.length = 0;

    locationSelect.innerHTML = "";
    var option = document.createElement("option");
    option.value = "none";
    option.innerHTML = "See all results:";
    locationSelect.appendChild(option);
}


/**
 * Creates on option containing the given :
 * @param name name of option
 * @param distance distance to origin adress
 * @param num value displayed in the option
 */
function createOption(name, distance, num) {
    var option = document.createElement("option");
    option.value = num;
    option.innerHTML = name;
    locationSelect.appendChild(option);
}

/**
 * Initializes the application
 * wil be called when maps is initialized
 */
function init() {
    displayAllLocations();
}