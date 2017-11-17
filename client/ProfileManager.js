/*jshint esversion: 6 */

/**
 * Handles user logout and profile on the main page. Provides profile
 * information to MasterController.
 * @module
 */

window.fbAsyncInit = function() {
  FB.init({
    appId            : '1113950092041996',
    autoLogAppEvents : true,
    cookie           : true,
    xfbml            : true,
    version          : 'v2.11'
  });

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

  FB.Event.subscribe('auth.statusChange', function(response) {
    statusChangeCallback(response);
  });
};

/**
 * Gets login status using the Facebook API.
 */
function getLoginStatus() {
  FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
  });
}

(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function isOnLocalhost() {
    return window.location.href.search("localhost") != -1;
}

/**
 * Callback used when login status is received. Redirects to login page
 * if not logged in.
 */
function statusChangeCallback(response) {
  console.log("statusChange");
  console.log(response);
  if (response.status != 'connected' && !isOnLocalhost()) {
    redirectToLoginPage();
  }
}

/**
 * Redirects user to the login page.
 */
function redirectToLoginPage() {
  window.location.replace("login.html");
}

/**
 * Logs out the user, using the Facebook API.
 */
function logout() {
  FB.logout(function(response) {
    // Logged out.
  });
}

/**
 * Gets the user Id, using the Facebook API.
 */
function getUserId(callback) {
  if (isOnLocalhost()) {
    callback('12345');  // test user ID
  }
  else {
    FB.getLoginStatus(function(response) {
      callback(response.authResponse.userID);
    });
  }
}

module.exports = {
  getUserId: getUserId,
  logout: logout
};
