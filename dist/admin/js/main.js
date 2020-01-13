// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
var db = new firebase.database();

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


// var updateResults = firebase.functions().httpsCallable('helloWorld');


// window.addEventListener('load', () => {

//     document.getElementById('update-button').addEventListener('click', (event) => {
//         document.getElementById('update-button').disabled = true;
//         updateResults({ event: "tmd19" }).then((result) => {
//             console.log(result.data)
//             document.getElementById('update-button').disabled = false;
//         })

//     })
// })

app = new Vue({
    el: "#app",
    data: {
        activeTemplate: 'test',
        activeDistrict: 0,
        templates: {
            test: {
                districts: [
                    {
                        title: "Hello",
                        
                    }
                ]
            }
        }
    },
    mounted() {
        this.getTemplate();
    },
    methods: {
        getTemplate() {
            templatesRef = db.ref('templates/');
            templatesRef.once('value', function(snapshot) {
                app.templates = snapshot.val()
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
        eventChange(key) {
            app.activeTemplate = key;
        },
        districtChange(key) {
            app.activeDistrict = key;
        },
    }
})