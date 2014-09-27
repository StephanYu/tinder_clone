



var location1 = [];
// [latitude, longitude];
var location2 = [];
// [latitude, longitude];

var coords;
refCoords = new Firebase("/geoLocation/uid1");
refCoords.on('value', function(snapshot) {
  coords = snaphot.val();
  location1.push(coords.latitude, coords.longitude);
});

var coords2;
refCoords2 = new Firebase("/geoLocation/uid2");
refCoords2.on('value', function(snapshot) {
  coords2 = snaphot.val();
  location2.push(coords2.latitude, coords2.longitude);
});

function distance (location1, location2) {

  var radius = 6371; // Earth's radius in kilometers
  // locationTwo.latitude - locationOne.latitude 
  var latDelta = degreesToRadians(location2[0] - location1[0]);
 // locationTwo.longitude - locationOne.longitude 
  var lonDelta = degreesToRadians(location2[1] - location1[1]);


  var a = (Math.sin(latDelta / 2) * Math.sin(latDelta / 2)) +
          (Math.cos(degreesToRadians(location1[0])) * Math.cos(degreesToRadians(location2[0])) *
          Math.sin(lonDelta / 2) * Math.sin(lonDelta / 2));

  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return radius * c;
}


function degreesToRadians(degrees) {
  return (degrees * Math.PI)/180;
}