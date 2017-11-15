window.fbAsyncInit = function() {
  FB.init({
    appId            : '1113950092041996',
    autoLogAppEvents : true,
    xfbml            : true,
    version          : 'v2.11'
  });

  FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
  });
};

(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function statusChangeCallback(response) {
  console.log("statusChange");
  console.log(response);
  if (response.status == 'connected') {
    redirectToMainPage();
  } else if (response.status == 'unknown') {
    FB.login();
  }
}

function redirectToMainPage() {
  window.location.replace("..");
}