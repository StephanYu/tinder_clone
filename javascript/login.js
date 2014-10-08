var currentUser = null;
var currentUserId = null;
var isNewUser = true;
var refRoot = new Firebase("https://tinder.firebaseio.com");
var refUsers = new Firebase("https://tinder.firebaseio.com/users");
var refLocation = new Firebase("https://tinder.firebaseio.com/geoLocation");
var refChat = new Firebase("https://tinder.firebaseio.com/chat");

$(document).ready(function() {

  seedUsers();

  function seedUsers() {
    
    refUsers.set({
    amberuid: {
      fName: "Amber",
      gender: "female",
      age: 20,
      photos: {
        1: "img/amber1.jpg",
        2: "img/amber2.jpg",
        3: "img/amber3.jpg",
        4: "img/amber4.jpg"
      }},
    blakeuid: {
      fName: "Blake",
      gender: "female",
      age: 28,
      likes: {
        "facebook:10152545844168859": true,
        "demouid": true
      },
      photos: {
        1: "img/blake1.jpg",
        2: "img/blake2.jpg",
        3: "img/blake3.jpg",
        4: "img/blake4.jpg"
      }},
    angelinauid: {
      fName: "Angelina",
      gender: "female",
      age: 26,
      likes: {
        "facebook:10152545844168859": true,
        "demouid": true
      },
      photos: {
        1: "img/angelina1.jpg",
        2: "img/angelina2.jpg",
        3: "img/angelina3.jpg",
        4: "img/angelina4.jpg"
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
  } // end of seedUsers


  
  

  

  function doesUserExist(user) {
    console.log("begin doesUserExist check");
  // check if that user already exists in the Firebase database (by connecting to Firebase and taking a snapshot.val() at user.uid)
    refUsers.child(user.uid).on("value", function (snapshot) {
      currentUser = snapshot.val();
    });

    // if user does not exist..
    if ( currentUser !== null && currentUser !== '' && currentUser !== undefined) {
      addUser(); 
    }
  }

  $("#fb-login").on("click", function() {
    console.log("begin facebook authClient");
    var authClient = new FirebaseSimpleLogin(refRoot, function (error, user) {
    console.log("begin FirebaseSimpleLogin function");
      if (error) {
        console.log("Firebase simple login error:" + error);
      } else if (user) {
        // upon activating authClient.login, if callback function returns a user...
        doesUserExist(user); //!!! CAUTION: added user parameter. test for correctness
        
        // ***IMPORTANT***
        currentUser = user;
        currentUserId = user.uid;
        console.log("Current user object: " + currentUser + "currentUserId: " + currentUserId);
      } else {
        console.log("user is not logged in");
      }
    }); // end of authClient
    authClient.login("facebook", {
      preferRedirect: true,
      rememberMe: true,
      scope: "email,user_likes,user_friends"
    });
  }); // end of #fb-login

  function addUser() {
    console.log("begin addUser function");
    refUsers.set({
      provider: user.provider,
      providerId: user.id,
      displayName: user.displayName,
      fName: "Stephan",
      gender: user.thirdPartyUserData.gender,
      age: user.thirdPartyUserData.age_range.min,
      photos: {
        1: user.thirdPartyUserData.picture.data.url
      },
      // meets_criteria: {},
      // likes: {},
      // dislikes: {}
    });

    addPreferences();
  } // end of addUser()

  var genderPref;
  $('.btn-group .btn').click(function() {
   genderPref = $(this).attr("value");
  });

  function addPreferences() {
    console.log("begin addPreferences function");
    var minAgePref = $('#min-age-pref').val();
    var maxAgePref = $('#max-age-pref').val();
    var radiusPref = $('#radius-pref').val();

    refUsers.child(currentUserId).child("preferences").set(
    { 
      gender: genderPref, 
      min_age: minAgePref, 
      max_age: maxAgePref,
      radius: radiusPref
    });

    setMeetsCriteria();

  } // end of addPreferences


  var userPreferences;
  var allUsers;
  function setMeetsCriteria() {
    console.log("begin setMeetsCriteria function");
    refUsers.child(currentUserId).child("preferences").on("value", function (snapshot) {
      userPreferences = snapshot.val();
    });

    refUsers.on("value", function (snapshot) {
      allUsers = snapshot.val();
    });

    // loop through all users to see if any meets currentUser's preferences
    $.each(allUsers, function (userId, singleUserObject) {
      if (userPreferences.gender === singleUserObject.gender &&
          userPreferences.min_age >= singleUserObject.age &&
          userPreferences.max_age <= singleUserObject.age) {
        // then add user to currentUser's "meets_criteria" list
        refUsers.child(currentUserId).child("meets_criteria").set(
        { userId: {
            fName: singleUserObject.fName,
            age: singleUserObject.age,
            photos: singleUserObject.photos }
        });
      }
    }); // end of $.each loop
  } // end of setMeetsCriteria

}); // end of document ready

