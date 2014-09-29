
$(document).ready(function() {

var isNewUser = true;
var currentUser = null;
var currentUserId = null;
var refRoot = new Firebase("https://tinder.firebaseio.com");
var refUsers = new Firebase("https://tinder.firebaseio.com/users/");
var refLocation = new Firebase("https://tinder.firebaseio.com/geoLocation");
var refChat = new Firebase("https://tinder.firebaseio.com/chat");

//add test-users to the database for demo-purposes
seedUsers();

// Firebase Facebook log-in
var authClient = new FirebaseSimpleLogin(refRoot, function(error, user) { 
  // log error if there is an error
  if (error) {
    console.log("Firebase simple login error:" + error);
  // if user exists, begin user authenticateion with Firebase
  } else if (user) {
    console.log(user);
    var objUser = new Firebase( refUsers + user.uid );
    
    objUser.once('value', function(snapshot) {
      currentUser = snapshot.val();
      console.log("Snapshot of objUser:" + currentUser);
    });

      // // if currentUser exists then change isNewUser = false
    if ( currentUser !== null && currentUser !== '' && currentUser !== undefined) {
      console.log("false event");
      isNewUser = false;
    }

    // check refUsers if user exists
    if ( isNewUser ) {
      // save new user's profile into Firebase under their uid
      refUsers.child(user.uid).set({
        provider: user.provider,
        providerId: user.id,
        displayName: user.displayName,
        // firstName: user.first_name,
        gender: user.thirdPartyUserData.gender,
        age: user.thirdPartyUserData.age_range.min,
        picUrl: user.thirdPartyUserData.picture.data.url
      });

    }
      currentUser = user;
      currentUserId = user.uid;
      console.log("User ID: " + currentUserId + ", Provider: " + user.provider);

      // $("#main-go-oogle").attr("style", "");
      // $("#go-oogle-login").attr("style", "display: none");
  } else {
    // user is logged out
    console.log("user logged out");
  }
});

$("#fb-login").on('click', function() {
  authClient.login('facebook', {
    preferRedirect: true,
    rememberMe: true,
    scope: 'email,user_likes,user_friends'
  });
      addPreferences();

});


// $("#demo-btn").on('click', addPreferences);


var genderPref;
$('.btn-group .btn').click(function() {
 genderPref = $(this).attr("value");
 console.log(genderPref);
});


function addPreferences() {
  var minAgePref = $('#min-age-pref').val();
  var maxAgePref = $('#max-age-pref').val();
  var radiusPref = $("#radius-pref").val();

  // var refPreferences = new Firebase(refUsers + currentUserId);

  refUsers.child(currentUserId).child("preferences").set(
    { 
      gender: genderPref, 
      min_age: minAgePref, 
      max_age: maxAgePref,
      radius: radiusPref
    }
  );
}

function seedUsers() {
  
  refUsers.set({
  amberuid: {
    firstName: "Amber",
    gender: "female",
    age: 20,
    photos: {
      1: "http://static.hdw.eweb4.com/media/wp_400/1/1/3245.jpg",
      2: "img/amber1.jpg",
      3: "img/amber2.jpg",
      4: "img/amber3.jpg"
    }},
  blakeuid: {
    firstName: "Blake",
    gender: "female",
    age: 28,
    photos: {
      1: "img/blake1.jpg",
      2: "img/blake2.jpg",
      3: "img/blake3.jpg",
      4: "img/blake4.jpg"
    }},
  zoeuid: {
    firstName: "Zoe",
    gender: "female",
    age: 25,
    photos: {
      1: "img/zoe1.jpg",
      2: "img/zoe2.jpg",
      3: "img/zoe3.jpg",
      4: "img/zoe4.jpg"
    }}
  });
}

var usersArray = [];

// function filterOogles() {
// console.log("filterOogles");
//   refUsers.on('value', 
//     function (snapshot) {
//       var userObject = snapshot.val();
//     },
//     function (errorObject) {
//       console.log('The read failed: ' + errorObject.code);
//     }
//   );

//   $.each(userObject, function (userId, singleUserObject) {

//     if ( singleUserObject.gender === currentUserId.preferences.gender && singleUserObject.age > currentUserId.preferences.min_age && singleUserObject.age < currentUserId.preferences.max_age) {

//       // console.log(singleUserObject.firstName);
//       // store user in "meets_criteria" table of specified user
//       // stephanRef = new Firebase("https://tinder.firebaseio.com/users/" + currentUser + "meets_criteria/" + userId);

//       refUsers.child(currentUserId).child("meets_criteria").child(userId).set( {
//          age: singleUserObject.age,
//          firstName: singleUserObject.firstName,
//          // picUrl: singleUserObject.picUrl
//       });

//     } else {
//       console.log("user does not meet criteria");
//     }

//   });

// }


}); //end of document.ready();
