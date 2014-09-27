  var isNewUser = true;
  var currentUser = null;
  var myRef = new Firebase("https://tinder.firebaseio.com");

  var authClient = new FirebaseSimpleLogin(myRef, function(error, user) { 
    if (error) {
      console.log(error);
    } else if (user) {

      console.log("isNewUser checking started");

      var linkToUserInfo = "https://tinder.firebaseio.com/users/" + user.uid;

      var userRef = new Firebase( linkToUserInfo );
        
      userRef.once('value', function(snap) {
        console.log("here's the snap:" + snap.val());
        currentUser = snap.val();
      });

      // check users firebase if user exists
      // if currentUser exists then isNewUser = false
      if ( currentUser !== null && currentUser !== '' && currentUser !== undefined) {
        console.log("false event - user does not exist");
        isNewUser = false;
      }

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
        // currentUser = user.uid;
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