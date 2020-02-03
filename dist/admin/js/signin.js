
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
    document.getElementById('logout-button').addEventListener('click', () => {
        firebase.auth().signOut().then(console.log("Signed Out"))
    })
})

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        window.location = "./controlpanel.html"
    } else {
        
    }
});