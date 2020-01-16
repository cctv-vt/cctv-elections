// Initialize the FirebaseUI Widget using Firebase.
// var ui = new firebaseui.auth.AuthUI(firebase.auth());
var db = new firebase.database();

// var uiConfig = {
//     callbacks: {
//         signInSuccessWithAuthResult: function (authResult, redirectUrl) {
//             // User successfully signed in.
//             // Return type determines whether we continue the redirect automatically
//             // or whether we leave that to developer to handle.
//             console.log(authResult)
//             document.getElementById('control-panel').style.display = 'block';
//             firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
//             return false;
//         },
//         uiShown: function () {
//             // The widget is rendered.
//             // Hide the loader.
//             document.getElementById('loader').style.display = 'none';
//         }
//     },
//     signInFlow: 'popup',
//     signInOptions: [
//         {
//             provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
//             requireDisplayName: false
//         }
//     ]
// }

// ui.start('#firebaseui-auth-container', uiConfig);


// var updateResults = firebase.functions().httpsCallable('helloWorld');
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)


window.addEventListener('load', () => {
    document.getElementById('auth-panel').addEventListener('submit', (event) => {
        var email = document.getElementById('email')
        var password = document.getElementById('password')
        firebase.auth().signInWithEmailAndPassword(email.value, password.value).catch( (error) => {
            console.log(error.code, error.message)
            // email.value = ''
            password.value = ''
        })
        event.preventDefault()
    })
})

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Signed in as', user.displayName)
      document.getElementById('auth-panel').style.display = "none"
      document.getElementById('control-panel').style.display = 'block';
    } else {
        // document.getElementById('auth-panel').style.display = "block"
    }
  });
  

app = new Vue({
    el: "#app",
    data: {
        loaded:false,
        activeTemplate: 'test',
        activeDistrict: 0
        
    },
    mounted() {
        this.getTemplate();
    },
    methods: {
        getTemplate() {
            templatesRef = db.ref('templates/');
            templatesRef.once('value', function(snapshot) {
                app.templates = snapshot.val()
                app.loaded = true
            })
        },
        saveTemplate() {
            activeDistrictRef = db.ref('templates/' + app.activeTemplate + '/districts/' + app.activeDistrict + '/')
            activeDistrictRef.set(app.templates[app.activeTemplate].districts[app.activeDistrict])

        },
        updateResults() {
            document.getElementById('update-button').disabled = true;
            firebase.functions().httpsCallable('updateDatabase')({ event: app.activeTemplate }).then((result) => {
                console.log(result.data)
                document.getElementById('update-button').disabled = false;
        })
        },
        eventChange(key, ev) {
            app.activeTemplate = key;
        },
        districtChange(key, ev) {
            app.activeDistrict = key;
        },
    }
})