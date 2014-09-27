  

  var isNewUser = true;
  var currentUser = null;
  var myRef = new Firebase("https://tinder.firebaseio.com");

  var authClient = new FirebaseSimpleLogin(myRef, function(error, user) { 
    if (error) {
      console.log(error);
    } else if (user) {
      // user authenticated with Firebase
      console.log("isNewUser checking started");
        var linkToUserInfo = "https://tinder.firebaseio.com/users/" + user.uid;

        var userRef = new Firebase( linkToUserInfo );
        
        userRef.once('value', function(snap) {
          console.log("here's the snap!");
          console.log(snap.val());
          currentUser = snap.val();
        });

        // // if currentUser exists then isNewUser = false
        if ( currentUser !== null && currentUser !== '' && currentUser !== undefined) {
          console.log("false event");
          isNewUser = false;
        }

      // check users firebase if user exists
      if ( isNewUser ) {
        // save new user's profile into Firebase under their user_id
        myRef.set({
          provider: user.provider,
          providerId: user.id,
          displayName: user.displayName,
          // firstName: user.first_name,
          gender: user.thirdPartyUserData.gender,
          age: user.thirdPartyUserData.age_range.min,
          picUrl: user.thirdPartyUserData.picture.data.url
        });
      }
        currentUser = user.uid;
        console.log("User ID: " + user.uid + ", Provider: " + user.provider);
    } else {
      // user is logged out
      console.log("user logged out");
    }
  });


  $(".facebook-log-in").on('click', function() {
    authClient.login('facebook', {
      preferRedirect: true,
      rememberMe: true,
      scope: 'email,user_likes,user_friends'
    });
  });

  $(".facebook-log-out").on('click', function() {
    authClient.logout();
  });

var newRef = new Firebase("https://tinder.firebaseio.com");

$('.test-users').on('click', function() {
  console.log("clicked test-users");

  var testUsers = newRef.child('users');

  testUsers.push({
    firstName: "Amber",
    gender: "female",
    age: 20,
    picUrl: "http://static.hdw.eweb4.com/media/wp_400/1/1/3245.jpg"
  });
  testUsers.push({
    firstName: "Megan",
    gender: "female",
    age: 28,
    picUrl: "http://img2.timeinc.net/people/i/2008/database/meganfox/megan_fox300a.jpg",
    likes: {
      "facebook:10152545844168859": true,
      "uid123": true,
      "uid111": true
    }
  });
  testUsers.push({
    firstName: "Miley",
    gender: "female",
    age: 22,
    picUrl: "http://www.phootoscelebrities.com/wp-content/uploads/2014/07/Miley-Cyrus-cute-photos.jpg"
  });
  testUsers.push({
    firstName: "Doug",
    gender: "male",
    age: 22,
    picUrl: "abc.jpg"
  });  
  testUsers.push({
    firstName: "Erik",
    gender: "male",
    age: 23,
    picUrl: "abc.jpg"
  });  

});


var userArray = [];
var userObject;
var postsRef = new Firebase("https://tinder.firebaseio.com/users");
// Attach an asynchronous callback to read the data 
postsRef.on('value', function (snapshot) {
  userObject = snapshot.val();
  console.log("snapshot of user object");
  // console.log(userObject);
}, function (errorObject) {
  console.log('The read failed: ' + errorObject.code);
});



$(".blah").on('click', function() {
  $.each(userObject, function (userId, singleUserObject) {
    
    if ( singleUserObject.gender === "female" && singleUserObject.age > 21 && singleUserObject.age < 30) {
      console.log(singleUserObject.firstName);
      // store user in "meets_criteria" table of specified user
      stephanRef = new Firebase("https://tinder.firebaseio.com/users/facebook%3A10152545844168859/meets_criteria/" + userId);

      stephanRef.set( {
         age: singleUserObject.age,
         firstName: singleUserObject.firstName,
         picUrl: singleUserObject.picUrl
      });

    } else {
      console.log("user does not meet criteria");
    }
  });
});

var newUserObject = new Firebase("https://tinder.firebaseio.com/users/facebook%3A10152545844168859/meets_criteria");
newUserObject.on('value', function (snapshot) {
  newUserObject = snapshot.val();
});

$(".show-meets-criteria").on('click', function() {
  $.each(newUserObject, function (userId, userDetails) {
    $('.meets-criteria').append(userDetails.firstName);
    $('.meets-criteria').append(userDetails.age);

    $newImg = "<img src='x' class='meets-criteria-img'>";
    $('.meets-criteria').append( $newImg );
    $('.meets-criteria-img:last').attr("src", userDetails.picUrl);

    $("#like").attr("class", userId);
    $("#dislike").attr("class", userId);

    // attr class="userId" value/id/name="like/disklike"
    // on 'click', store value of button in Stephan's "likes" or "dislikes"
    $("#like").on('click', function() {
      var likePerson = new Firebase("https://tinder.firebaseio.com/users/facebook%3A10152545844168859/likes/" + userId);
      var linkMeetsCriteria = new Firebase("https://tinder.firebaseio.com/users/facebook%3A10152545844168859/meets_criteria/" + userId);
      console.log(userId);
      likePerson.set(true);
      // likePerson.update( userId = true );
      // likePerson.push( newUserObject[userId] = true );
      // likePerson.update( {uid: userDetails.uid, value: true} );
      linkMeetsCriteria.remove();
    });

    $("#dislike").on('click', function() {
      var dislikePerson = new Firebase("https://tinder.firebaseio.com/users/facebook%3A10152545844168859/dislikes");
      console.log(likePerson);
      dislikePerson.push( userId = true );
    });

  });
});







  var authRef = new Firebase("https://tinder.firebaseio.com/.info/authenticated");
  authRef.on("value", function(snap) {
    if (snap.val() === true) {
      console.log("authenticated");
    } else {
      console.log("not authenticated");
    }
  });

  // var postName = new Firebase("https://tinder.firebaseio.com/users/facebook%3A10152545844168859/displayName");
  // postName.on("value", function(snap) {
  //   $(".user").append(snap.val());
  // });

  // // var postName = new Firebase("https://tinder.firebaseio.com/users/facebook%3A10152545844168859/firstName");
  // // postName.on("value", function(snap) {
  // //   $(".user").append(snap.val());
  // // });

  // var postAge = new Firebase("https://tinder.firebaseio.com/users/facebook%3A10152545844168859/age");
  // postAge.on("value", function(snap) {
  //   $(".user").append(snap.val());
  // });

  // var postPic = new Firebase("https://tinder.firebaseio.com/users/facebook%3A10152545844168859/picUrl");
  // postPic.on("value", function(snap) {
  //   $(".user_img").attr('src', snap.val());
  // });

  var myRef = new Firebase("https://tinder.firebaseio.com/users/facebook:10152545844168859");
  var myDataRef = myRef.child("preferences");


  // + currentUser.uid;

  // var myDataRef = new Firebase(updateUrl);
  
  $('#submit-btn').on('click', function() {
    var min_age = $('#min_age').val();
    console.log(min_age);
    var max_age = $('#max_age').val();
    console.log(min_age);
    var myRadio = $('input[name=gender]');
    var checkedValue = myRadio.filter(':checked').val();
    console.log(checkedValue);

    // store as male: true or gender: male
    myDataRef.update( { 
      gender: checkedValue, 
      min_age: min_age, 
      max_age: max_age
      });
  });


  $("#show-matches").on('click', function() {

    var myRef = new Firebase("https://tinder.firebaseio.com/users/facebook:10152545844168859/likes");

    myRef.on('value', function(snap) {
      myRef = snap.val();
      // myRef is an object of { uid: true, uid2: true }
    });

    $.each(myRef, function(key, value) {
      var doesOtherPersonLikeMe = "https://tinder.firebaseio.com/users/" + key + "/likes/" + "facebook:10152545844168859";

      if ( doesOtherPersonLikeMe ) {
        console.log(key + " likes me");
        // UI to show the user

      }

    });    


  });
    
// Stephan chat with Amber

$("#chat-submit").on('click', function() {

  var chatRef = new Firebase("https://tinder.firebaseio.com/chats/facebook%3A10152545844168859/-JXo0RWK9pGzARGeMec_"); 

  var chatMessage = $("#chat-message").val();

  chatRef.push( { 
    user: currentUser.uid,
    message: chatMessage
  });

});


var chatRef = new Firebase("https://tinder.firebaseio.com/chats/facebook:10152545844168859/-JXo0RWK9pGzARGeMec_"); 
chatRef.on('value', function(snapshot) {
  chatRef = snapshot.val();
});


$(".show-chat").on('click', function() {
  console.log("button clicked");
  $.each(chatRef, function(key, value) {
    console.log(key);
    var $msg = "<p>" + value.user + ": " + value.message + "</p>";
    $(".chat-history").append( $msg );
  });

});



<<<<<<< HEAD
<<<<<<< HEAD
if (geoPosition.init()) {
  geoPosition.getCurrentPosition(geoSuccess, geoError);
}

function geoSuccess(p) {
  console.log(p);
  alert("Found you at latitude " + p.coords.latitude +
        ", longitude " + p.coords.longitude + 
        ", accuracy " + p.coords.accuracy );

  // connect to Firebase
  // store p.coords

  var refLocation = new Firebase("https://tinder.firebaseio.com/geoLocation/facebook:10152545844168859/");

  refLocation.set({
    latitude: p.coords.latitude,
    longitude: p.coords.longitude,
    accuracy: p.coords.accuracy,
    timestamp: p.timestamp
  });


  var refAmberLocation = new Firebase("https://tinder.firebaseio.com/geoLocation/-JXo0RWK9pGzARGeMec_");
  refAmberLocation.set({
    latitude: 37.76,
    longitude: -122.49,
    accuracy: 20,
    timestamp: 1411847109084
  });

  var refMeganLocation = new Firebase("https://tinder.firebaseio.com/geoLocation/-JXo0RWMxmP8lH4IcxmH");
  refMeganLocation.set({
    latitude: 37.732,
    longitude: -122.40,
    accuracy: 20,
    timestamp: 1411847109084
  });

  var refMileyLocation = new Firebase("https://tinder.firebaseio.com/geoLocation/-JXo0RWOAbijpQaGo9r5");
  refMileyLocation.set({
    latitude: 37.77,
    longitude: -122.5,
    accuracy: 20,
    timestamp: 1411847109084
  });


  // .then(function() {
  //   console.log("Provided key has been added to GeoFire");
  // }, function(error) {
  //   console.log("Error: " + error);
  // });

  // var firebaseRef = new Firebase("https://tinder.firebaseio.com/geolocation");
  // var geoFire = new GeoFire(firebaseRef);

  // geoFire.set("facebook:10152545844168859", [37.785326, -122.405696]).then(function() {
  //   console.log("Provided key has been added to GeoFire");
  // }, function(error) {
  //   console.log("Error: " + error);
  // });

  // geoFire.get("facebook:10152545844168859").then(function(location) {
  // if (location === null) {
  //   console.log("Provided key is not in GeoFire");
  // }
  // else {
  //   console.log("Provided key has a location of " + location);
  //   }
  // }, function(error) {
  //   console.log("Error: " + error);
  // });

}


var location1 = [];
// [latitude, longitude];
var location2 = [];
// [latitude, longitude];

var coords;
refCoords = new Firebase("https://tinder.firebaseio.com/geoLocation/facebook:10152545844168859/");
refCoords.on('value', function(snapshot) {
  coords = snapshot.val();
  location1.push(coords.latitude, coords.longitude);
});

var coords2;
refCoords2 = new Firebase("https://tinder.firebaseio.com/geoLocation/-JXo0RWK9pGzARGeMec_");
refCoords2.on('value', function(snapshot) {
  coords2 = snapshot.val();
  location2.push(coords2.latitude, coords2.longitude);
});

function distance (location1, location2) {
  // validateLocation(location1);
  // validateLocation(location2);

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

$('.calculate-distance').on('click', function() {
  var distanceBetween = distance(location1, location2);
  console.log(distanceBetween);
});

function degreesToRadians(degrees) {
  return (degrees * Math.PI)/180;
}

function geoError() {
  alert("Could not find you!");
}

// clicking on location-lookup-permission link will lookup your location
function lookup_location() {
  geoPosition.getCurrentPosition(show_map, show_map_error);
}

function show_map(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  var accuracy = position.coords.accuracy;
  // let's show a map or do something interesting!
}

function show_map_error() {
  $("#live-geolocation").html('Unable to determine your location.');



// GEOLOCATION QUERY 
// firebase_connection/gelocations/stephanid

//GEOFIRE
// var firebaseRef = new Firebase("https://tinder.firebaseio.com/geoLocation/facebook:10152545844168859/");
// var geoFire = new GeoFire(firebaseRef);

// //SET GEOFIRE Location 
// //we need to set the location using coordinates from the HTML5 geolocation API
// var userLocation;
// geoFire.set(geoFire, [37.785326, -122.405696]).then(function() {
//   console.log("Provided key has been added to GeoFire");
// }, function(error) {
//   console.log("Error: " + error);
// });

// //GET GEOFIRE Location
// geoFire.get(refLocation).then(function(latitude) {
//   if (latitude === null) {
//     console.log("Provided key is not in GeoFire");
//   }
//   else {
//     console.log("Provided key has a location of " + latitude);
//   }
// }, function(error) {
//   console.log("Error: " + error);
// });

//this GEOQUERY will be set to our Current User's location from the HTML5 Geolocation API
var geoQuery = geoFire.query({
  center: [37.4, -122.6],
  radius: 1.609 //kilometers
});

// Every time a key (a user in our case) enters the query, the callback we defined will get called with data about that location:
geoQuery.on("key_entered", function(key, location, distance) {
  console.log("Bicycle shop " + key + " found at " + location + " (" + distance + " km away)");
});
// Every time a key (a user in our case) exits the query, the callback we defined will get called for each key which leaves the query:
geoQuery.on("key_exited", function(key, location, distance) {
  console.log("Bicycle shop " + key + " left query to " + location + " (" + distance + " km away)");
});
//Updating query criteria
// Canceling queries
// Dealing with keys which move around within a query

}
=======
>>>>>>> parent of be39f84... added geolocation and chat functionality
=======
>>>>>>> parent of be39f84... added geolocation and chat functionality
