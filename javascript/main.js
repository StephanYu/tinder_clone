  

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
        currentUser = user;
        console.log("User ID: " + user.uid + ", Provider: " + user.provider);
    } else {
      // user is logged out
      console.log("user logged out");
    }
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
      // "facebook:10152545844168859": {
      //   likes: true,
      // }

      "facebook:10152545844168859": true,
      "uid123": true,
      "uid111": true
      // loop through Megan's likes
      // for each key, value
      // meganid.likes[stephanid] = true
      // stephanid.likes[meganid] = true
      // if ( megan.likes[key] === key.likes[meganid] )
      // then show as match
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


  // $("#show-matches")

//searching for matches
// users.forEach();
// var myMatch = 
// new Firebase("https://tinder.firebaseio.com/users")
//   .startAt("female")
//   .endAt("female")
//   .once("value", function(snap){
//     console.log(snap.val());
//   });
  
//look through each child node for gender = female && min_age = 20 && max_age = 30 && math.abs(user_location - match.location) = 50

  //add security rules


// // photo link
// user.thirdPartyUserData.picture.data.url


// // at least 13, 18, 21
// user.thirdPartyUserData.age_range.min
// // under 17, 20
// user.thirdPartyUserData.age_range.max



