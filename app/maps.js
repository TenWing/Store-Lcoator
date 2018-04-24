'use-strict';

/**
 * Google Maps : Map object
 */
var map;

/**
 * Object used to render directions on the map
 */
var directionsDisplay;

/**
 * Object used for autocomplete search inputs
 */
var autocomplete;

/**
 * Markers displayed on the map
 * @type {Array}
 */
var markers = [];

/**
 * The info window used by the API to display info about markers
 */
var infoWindow;

/**
 * Map center, centered on Rennes, France
 * @type {Object}
 */
var center = {lat: 48.110049, lng: -1.677813};

/**
 * Initialization function
 * - initializes google map
 * - initializes DOM elements
 */
function initMap() {
    // creates map centered on Rennes
    map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 11,
        mapTypeId: 'roadmap',
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        }
    });
    infoWindow = new google.maps.InfoWindow();

    // Initializes the directions service
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);

    // Toggle autocomplete on the input field
    autocomplete = new google.maps.places.Autocomplete(document.getElementById("addressInput"));
    autocomplete.bindTo('bounds', map);

    // Binds the searchlocations() on click of the search button
    document.getElementById("searchButton").onclick = searchLocations;

    // Enables a click event to be fired when the user selects a marker in the select list
    locationSelect = document.getElementById("locationSelect");
    locationSelect.onselect = function() {
        var markerNum = locationSelect.options[locationSelect.selectedIndex].value;
        if (markerNum != "none") {
            google.maps.event.trigger(markers[markerNum], 'click');
        }
    };

    // Calls to init the application after maps inits
    init();
}

/**
 * Creates a marker on the map
 * @param latlng latlng pair to place the marker
 * @param name the name of the marker
 * @param address textual adress
 */
function createMarker(latlng, name, address) {
    var html = "<b>" + name + "</b> <br/>" + address;
    var marker = new google.maps.Marker({
        map: map,
        position: latlng,
        zIndex: 1
    });

    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);

        // Markers created like so are locations so whenever we click them
        // we try to compute directions and display them on the map
        // however the 1st time we arrive, there are no user adress so nothing is done
        if(userAddress.address != undefined && userAddress.position != undefined) {
            computeDirectionsTo(latlng);
        }
    });

    markers.push(marker);
}

/**
 * Adds the user's adress on the map as a marker
 * @param position the position geocoded for the marker
 */
function addUserMarker(position) {
    var user = new google.maps.Marker({
        position: position,
        map: map,
        icon: "user_location.png",
        zIndex: 10
    });

    // The user's address marker is just for info, no directions computed on click
    google.maps.event.addListener(user, 'click', function() {
        infoWindow.setContent("<b>" + userAddress.address + "</b><br/>" + center.lat + ", " + center.lng);
        infoWindow.open(map, user);
    });

    markers.push(user);

    // we create on option to easily select the user's address on the map
    createOption("User adress", 0, 0);
}

/**
 * Computes the direction to the given position from the user's address
 * displays it on the map
 * @param position the position to go to
 */
function computeDirectionsTo(position) {

    // We set the map in case service was toggled off when UI resets
    directionsDisplay.setMap(map);
    var directionsService = new google.maps.DirectionsService();

    // From user's address to location
    var request = {
        origin: userAddress.position,
        destination: position,
        travelMode: 'DRIVING'
    };

    directionsService.route(request, function(result, status) {
        if (status == 'OK') {

            // Show the path on the map
            directionsDisplay.setDirections(result);

            // We fill the directions instructions in the modal
            var div = document.getElementById("directionsInstructions");
            var leg = result.routes[0].legs[0];
            div.innerHTML = "<p></p><b>From </b>" + leg.start_address + " <b> to </b>" + leg.end_address + "</p>";
            div.innerHTML += "<p>distance : " + leg.distance.text + "<br/>" + "duration : " + leg.duration.text + "</p>";

            for(var i = 0; i < leg.steps.length; i++) {
                var step = leg.steps[i];
                div.innerHTML += "<p>" + step.instructions + "</p>"
            }

            // Modal is enabled but not showed by default
            document.getElementById("modalToggle").disabled = undefined;
            hideModal();
        }
    });
}