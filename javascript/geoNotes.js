

// detection (of support); error handling; options

function get_location() {
  // if Modernizer detects your browser supports geolocation
  if (Modernizr.geolocation) {
    navigator.geolocation.getCurrentPosition(show_map, hundle_error);
  } else {
    // no native support; maybe try a fallback?
  }
}

function show_map(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  // let's show a map or do something interesting!
}

// guaranteed properties
// coords.latitude
// coords.longitude
// coords.accuracy

if (geoPosition.init()) {
  geoPosition.getCurrentPosition(geoSuccess, geoError);

}

function geoSuccess(p) {
  alert("Found you at latitude " + p.coords.latitude +
        ", longitude " + p.coords.longitude);
}
function geoError() {
  alert("Could not find you!");
}

function lookup_location() {
  geoPosition.getCurrentPosition(show_map, show_map_error);
}

function show_map_error() {
  $("#live-geolocation").html('Unable to determine your location.');
}


