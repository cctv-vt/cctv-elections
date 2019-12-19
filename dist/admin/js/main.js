// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            console.log(authResult)
            document.getElementById('control-panel').style.display = 'block';
            firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            return false;
        },
        uiShown: function () {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
        }
    },
    signInFlow: 'popup',
    signInOptions: [
        {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: false
        }
    ]
}

ui.start('#firebaseui-auth-container', uiConfig);


var updateResults = firebase.functions().httpsCallable('updateDatabase');

window.addEventListener('load', () => {
    document.getElementById('update-button').addEventListener('click', (event) => {
        document.getElementById('update-button').disabled = true;
        updateResults({ event:"tmd19" }).then((result) => {
            console.log(result.data)
            document.getElementById('update-button').disabled = false;
        })
    })
})