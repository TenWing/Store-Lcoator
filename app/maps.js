'use-strict';

/**
 * Google Maps : Map object
 */
var map;


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
    var rennes = center;
    map = new google.maps.Map(document.getElementById('map'), {
        center: rennes,
        zoom: 11,
        mapTypeId: 'roadmap',
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        }
    });
    infoWindow = new google.maps.InfoWindow();

    document.getElementById("searchButton").onclick = searchLocations;

    locationSelect = document.getElementById("locationSelect");
    locationSelect.onchange = function() {
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


    google.maps.event.addListener(user, 'click', function() {
        infoWindow.setContent("<b>" + userAdress + "</b><br/>" + center.lat + ", " + center.lng);
        infoWindow.open(map, user);
    });

    markers.push(user);
}