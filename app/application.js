'use-strict';

/**
 * The DOM element containing the research results
 */
var locationSelect;

/**
 * If we display the modal for directions
 * @type {boolean}
 */
var showDirectionsModal = false;

/**
 * Resets all fields an displays all locations in the application
 * called the first time on arriving in the application
 */
function displayAllLocations() {
    // Wipes all markers and researchc results
    clearLocations();

    // Adds all locations in the DB on screen
    addLocations(locationsData.locations);
}

/**
 * Adds a list of locations to the application
 * @param _locations the array of application
 */
function addLocations(_locations) {

    // We sort the locations given by distance
    _locations.sort(function(a, b){
        if(a.distance < b.distance) return -1;
        if(a.distance > b.distance) return 1;
        return 0;
    });

    var bounds = new google.maps.LatLngBounds();

    // we use the optionIndex because there is also the marker for the user's address that is not a location in the DB
    var optionIndex = locationSelect.options.length - 1;

    // For each location, create marker & option
    for (var i = 0; i < _locations.length; i++) {
        var location = _locations[i];
        var name = location.name;
        var address = location.address;
        var distance = parseFloat(location.distance);
        var latlng = new google.maps.LatLng(
            parseFloat(location.lat),
            parseFloat(location.lng));

        createOption(name, distance, optionIndex + i);
        createMarker(latlng, name, address);
        bounds.extend(latlng);
    }

    // Extends the map view to fit all locations
    map.fitBounds(bounds);
}


/**
 * Clears all markers indicating locations on the map
 * also clears research results in locationsSelect
 */
function clearLocations() {

    // Closes the infoWindow
    infoWindow.close();

    // Wipes all markers
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers.length = 0;

    // Resets the research results
    locationSelect.innerHTML = "";
    var option = document.createElement("option");
    option.value = "none";
    option.innerHTML = "See all results:";
    locationSelect.appendChild(option);
}


/**
 * Creates on option containing the given :
 * @param name name of option
 * @param distance distance to origin address
 * @param num the index in the markers tab for this option (used to trigger click event)
 */
function createOption(name, distance, num) {
    var option = document.createElement("option");
    option.value = num;
    option.innerHTML = name + " : " + (distance / 1000).toFixed(1) + "km";
    locationSelect.appendChild(option);
}

/**
 * Enables / disables the modal showing directions instructions
 */
function toggleModal() {
    if(!showDirectionsModal) {
        document.getElementById("modal").style.visibility = "visible";
        showDirectionsModal = true;
    }
    else {
        document.getElementById("modal").style.visibility = "hidden";
        showDirectionsModal = false;
    }
}

/**
 * Hides the modal whenever needed
 */
function hideModal() {
    document.getElementById("modal").style.visibility = "hidden";
    showDirectionsModal = false;
}

/**
 * Resets the UI whenever needed
 */
function resetUi() {
    // Resets modal
    document.getElementById("modalToggle").disabled = "true";
    document.getElementById("modal").style.visibility = "hidden";
    showDirectionsModal = false;

    // Resets directions displayed
    directionsDisplay.setMap(null);

    // Wipes all research results & markers
    clearLocations();
}

/**
 * Initializes the application
 * wil be called when maps is initialized
 */
function init() {
    displayAllLocations();
}