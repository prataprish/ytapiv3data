
var CLIENT_ID = '958654278538-d0s71qmr27u4c4tdde4dj802a167c9e0.apps.googleusercontent.com';
// OAuth2 CLIENT_ID, by google
var SCOPES = 'https://www.googleapis.com/auth/youtube';


function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

function initClient() {
  gapi.client.init({
    clientId: CLIENT_ID,
    scope: SCOPES
  }).then(function () {
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  });
}

function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    loadAPIClientInterfaces();
  } else {
    gapi.auth2.getAuthInstance().signIn(); // incase user not authenticated, shoots for authentication
  }
}

function loadAPIClientInterfaces() {
  gapi.client.load('youtube', 'v3',function(){
    document.getElementById('main').style.display = 'block';
  }); // final step while preparing for search
}
