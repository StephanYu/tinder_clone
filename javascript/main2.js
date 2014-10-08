
var currentUser = null;
var currentUserId = null;

$(document).ready(function() {

  // ON DOCUMENT READY
  
  var isNewUser = true;
  var refRoot = new Firebase("https://tinder.firebaseio.com");
  var refUsers = new Firebase("https://tinder.firebaseio.com/users");
  console.log("RefUsers: " + refUsers)
  var refLocation = new Firebase("https://tinder.firebaseio.com/geoLocation");
  var refChat = new Firebase("https://tinder.firebaseio.com/chat");

  //add test-users to the database for demo-purposes
  seedUsers();

  // Firebase Facebook log-in
  // ON CLICK OF FB BUTTON OR DEMO BUTTON
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

        // // if currentUser exists then change isNewUser = false
        if ( currentUser !== null && currentUser !== '' && currentUser !== undefined) {
          console.log("false event");
          isNewUser = false;
        }

        // check refUsers if user exists
        if ( isNewUser ) {
          // save new user's profile into Firebase under their uid
          refUsers.child(user.uid).update({
            provider: user.provider,
            providerId: user.id,
            displayName: user.displayName,
            fName: "Stephan",
            // fName: user.first_name,
            gender: user.thirdPartyUserData.gender,
            age: user.thirdPartyUserData.age_range.min,
            photos: {1: user.thirdPartyUserData.picture.data.url},
            meets_criteria: {},
            likes: {},
            dislikes: {}

          });
        }
        // HUGELY IMPORTANT
        currentUser = user;
        console.log("Current user object: " + currentUser);
        currentUserId = user.uid;
        console.log("User ID: " + currentUserId + ", Provider: " + user.provider);

        addPreferences();
      });


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

  });


  // $("#demo-btn").on('click', addPreferences);

  // var genderPref;
  // $('.btn-group .btn').click(function() {
  //  genderPref = $(this).attr("value");
  //  console.log(genderPref);
  // });


  function addPreferences() {

    var minAgePref = $('#min-age-pref').val();
    var maxAgePref = $('#max-age-pref').val();
    var radiusPref = $('#radius-pref').val();
    // var refPreferences = new Firebase(refUsers + currentUserId);

    refUsers.child(currentUserId).child("preferences").set(
      { 
        gender: "female", 
        min_age: minAgePref, 
        max_age: 30,
        radius: 50
      }
    );

    filterOogles();
  }

  function seedUsers() {
    
    refUsers.set({
    amberuid: {
      fName: "Amber",
      gender: "female",
      age: 20,
      photos: {
        1: "http://static.hdw.eweb4.com/media/wp_400/1/1/3245.jpg",
        2: "img/amber1.jpg",
        3: "img/amber2.jpg",
        4: "img/amber3.jpg"
      }},
    blakeuid: {
      fName: "Blake",
      gender: "female",
      age: 28,
      photos: {
        1: "img/blake1.jpg",
        2: "img/blake2.jpg",
        3: "img/blake3.jpg",
        4: "img/blake4.jpg"
      }},
    zoeuid: {
      fName: "Zoe",
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

  var userObject;

  function filterOogles() {
  console.log("function filterOogles() begin running...");

    refUsers.on("value", function (snapshot) {
      userObject = snapshot.val();
      // console.log("Snapshot of all user objects: " + userObject);
      // console.log(userObject);
    }); // end userObject snapshot

    refUsers.child(currentUserId).on("value", function (snapshot) {
        currentUserObject = snapshot.val();
        console.log("Snapshot of all current user object: ");
        console.log(currentUserObject);
    }); // end currentUserObject snapshot

    $.each(userObject, function (userId, singleUserObject) {

      console.log("Single user object: ");
      console.log(singleUserObject);

      if ( singleUserObject.gender === currentUserObject.preferences.gender && 
        singleUserObject.age >= currentUserObject.preferences.min_age && 
        singleUserObject.age <= currentUserObject.preferences.max_age) {

          console.log("Single user id: " + userId);
          console.log("Single user object: ");
          console.log(singleUserObject);

          refUsers.child(currentUserId).child("meets_criteria").child(userId).set( {
             age: singleUserObject.age,
             fName: singleUserObject.fName,
             photos: singleUserObject.photos
          });
      } else {
        console.log("User does not meet criteria");
      } // end of meets_criteria
    }); // end of $.each
  } // end filterOogles()


  var ooglesArray = [];
  var meetsCriteriaArray = [];

  // refUsers.child(currentUserId).child("meets_criteria").on("value", function (snapshot) {
    
  //   meetsCriteriaArray = snapshot.val();
  //   console.log(meetsCriteriaArray);
  //   console.log("meetsCriteriaArray");

  //   $.each(meetsCriteriaArray, function (userId, singleUserObject) {
  //     console.log("singleUserObject.photos[1]:");
  //     console.log(singleUserObject.photos[1]);
  //     ooglesArray.push(singleUserObject);
  //     console.log(ooglesArray);

  //   }); // end of $.each
  // }); // end of meets_criteria snapshot


  // $("#photo1").attr("src", meetsCriteriaArray[0].photos[1]);

  // function showOogles() {
  //   console.log("Begin show oogles");
  //   $("#photo1").attr("src", "something");
  //   $("#photo2").attr("src", "something");
  //   $("#photo3").attr("src", "something");
  //   $("#photo4").attr("src", "something");
  // }

}); // end of document.ready();
