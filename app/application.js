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
    clearLocations();
    addLocations(locationsData.locations);
}

/**
 * Adds a list of locations to the application
 * @param _locations the array of application
 */
function addLocations(_locations) {

    _locations.sort(function(a, b){
        if(a.distance < b.distance) return -1;
        if(a.distance > b.distance) return 1;
        return 0;
    });

    var bounds = new google.maps.LatLngBounds();
    var optionIndex = locationSelect.options.length - 1;

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
    document.getElementById("modalToggle").disabled = "true";
    document.getElementById("modal").style.visibility = "hidden";
    showDirectionsModal = false;
    directionsDisplay.setMap(null);
    clearLocations();
}

/**
 * Initializes the application
 * wil be called when maps is initialized
 */
function init() {
    displayAllLocations();
}