// Initialize the FirebaseUI Widget using Firebase.
// var ui = new firebaseui.auth.AuthUI(firebase.auth());
var db = new firebase.database();

var url = new URLSearchParams(window.location.search);
var ev = url.get("ev") || "tmd19"
var d = url.get("d") || 0
var mode = url.get("m") || "live"

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log('Signed in as', user.displayName)
        //   document.getElementById('auth-panel').style.display = "none"
        document.getElementById('control-panel').style.display = 'block';
    } else {
        window.location = "./index.html"
    }
});


app = new Vue({
    el: "#app",
    data: {
        loaded: false,
        mode: mode,
        activeTemplate: ev,
        activeDistrict: d
    },
    mounted() {
        this.getTemplate();
    },
    methods: {
        getTemplate() {
            templatesRef = db.ref('templates/');
            templatesRef.once('value', function (snapshot) {
                app.templates = snapshot.val()
                app.originalTemplates = snapshot.val()
                app.loaded = true
            })
        },
        saveTemplate() {
            activeDistrictRef = db.ref('templates/' + app.activeTemplate + '/districts/' + app.activeDistrict + '/')
            activeDistrictRef.set(app.templates[app.activeTemplate].districts[app.activeDistrict])
            this.$forceUpdate()
        },
        saveEvSettings() {
            
        },
        updateResults() {
            document.getElementById('update-button').disabled = true;
            document.getElementById('update-button').classList.toggle('is-loading')
            firebase.functions().httpsCallable('updateDatabase')({ event: app.activeTemplate }).then((result) => {
                console.log(result.data)
                document.getElementById('update-button').disabled = false;
                document.getElementById('update-button').classList.toggle('is-loading')
            })
        },
        eventChange(key, ev) {
            // app.activeTemplate = key;
            window.location.href = "/controlpanel.html?ev=" + key + "&m=" + mode + "&d=" + 0
        },
        districtChange(key, ev) {
            // app.activeDistrict = key;
            window.location.href = "/controlpanel.html?ev=" + app.activeTemplate + "&m=template" + "&d=" + key
        },
        toggleModal(e) {
            m = document.getElementById(e).classList.toggle("is-active")
        },
        addVoteEntry(election) {
            console.log(election)
            for (result of election.results) {
                console.log(result.votes.length)
                if (result.votes.length > 0) {
                    result.votes.push(JSON.parse(JSON.stringify(result.votes[0])))
                } else {
                    result.votes[0] = {
                        value: "a1",
                        title: "Default"
                    }
                }
            }
            this.$forceUpdate()
        },
        removeVoteEntry(election, key) {
            if(window.confirm("Are you sure you want to delete the spreadsheet: " + election.results[0].votes[key].title + "?")) {
                console.log(election)
                for (result of election.results) {
                    console.log(result)
                    if (result.votes.length > 1) result.votes.splice(key, 1)
                }
                this.$forceUpdate()
            }
            
        },
        addResult(election, key) {
            election.results.push(JSON.parse(JSON.stringify(election.results[election.results.length - 1])))
            this.$forceUpdate()
        },
        removeResult(election, key) {
            if(window.confirm("Are you sure you want to delete the result: "+ election.results[key].name+"?")) {
                console.log(key)
                election.results.splice(key, 1)
                this.$forceUpdate()
            }
            
        },
        addElection(district) {
            console.log(district)
            if (district.elections) {
                district.elections.push({
                    title: "New Election",
                    results: [
                        {
                            name: "New Result",
                            votes: [
                                {
                                    title: "Vote Field",
                                    value: "a1"
                                }
                            ]
                        }
                    ]
                })
            } else {
                district.elections = [{
                    title: "New Election",
                    results: [
                        {
                            name: "New Result",
                            votes: [
                                {
                                    title: "Vote Field",
                                    value: "a1"
                                }
                            ]
                        }
                    ]
                }
                ]
            }
            
            this.$forceUpdate()
        },
        removeElection(district, key) {
            if(window.confirm("Are you sure you want to delete the ballot item: "+district.elections[key].title+"?")) {
                district.elections.splice(key,1)
                this.$forceUpdate()
            }
            
        }
    }
})