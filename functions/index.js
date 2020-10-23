const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { google } = require('googleapis');
const key = require('./key.json')
admin.initializeApp({
    credential: admin.credential.cert(key),
    databaseURL: "https://cctv-elections.firebaseio.com"
});
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onCall((data, context) => {
    
    return {
        text: data.event,
        uid: context.auth.uid
    }
});

exports.updateDatabase = functions.https.onCall((data, context) => {
    var event = data.event;

    var scopes = [
        "https://www.googleapis.com/auth/spreadsheets.readonly"
    ];
    

    
    
    const alphaNum = (s) => {
        a = [s[0].toLowerCase().charCodeAt(0) - 97, parseInt(s[1]+s[2]+s[3]) - 1];
        return a;
    };



    const createResults = (template, data) => {
        console.log('start update')
        //data
        var districts = template.districts
        for (var d in districts) {
            //d stands for districts
            for (var e in districts[d].elections) {
                for (var r in districts[d].elections[e].results) {
                    for (var v in districts[d].elections[e].results[r].votes) {
                        a = alphaNum(districts[d].elections[e].results[r].votes[v].value)
                        console.log(districts[d].elections[e].results[r].votes[v].value)
                        console.log(a)
                        if (data[a[1]][a[0]]) {
                            console.log(parseInt(data[a[1]][a[0]]))
                            districts[d].elections[e].results[r].votes[v].value = parseInt(data[a[1]][a[0]]);
                        } else {
                            districts[d].elections[e].results[r].votes[v] = 0;
                        }
                        
                    }
                }
            }
        }
        return districts;
    };

    //Retreive token for service account (key.json)
    var token = new Promise((resolve, reject) => {
        var jwtClient = new google.auth.JWT(
            key.client_email,
            null,
            key.private_key,
            scopes
        );

        jwtClient.authorize( (error, tokens) => {
            if (error) {
                console.log("Error making request to generate access token:", error);
                reject(error);
            } else if (tokens.access_token === null) {
                reject(new Error("No access token found: " + error));
            } else {
                var accessToken = tokens.access_token;
                resolve(accessToken);
            }
        })
    });

    //Retrive template from /templates/ in the database based on the 'f' query eg: ?f=tmd19 gets /templates/tmd19
    var template = new Promise((resolve, reject) => {
        console.log(event)
        if (event) {
            var evTemplate = admin.database().ref('/templates/' + event);
            evTemplate.once('value', (snapshot) => {
            	resolve(snapshot.val());
            })
        } else {
            reject(new Error("No Event Given"));
        }
        
    });
    

    // eslint-disable-next-line promise/catch-or-return
    return Promise.all([token, template]).then((value) => {
        var settings = value[1].evSettings
        var sheets = google.sheets({ version: "v4" });
        return new Promise((resolve, reject) => {
            if (context.auth.uid === 'ZsyOQx7MOGcfTNe0XBjHRLtkmmA3') {
                sheets.spreadsheets.values.get({
                    access_token: value[0],
                    spreadsheetId: settings.sheetId,
                    range: settings.sheetsPageName + '!A1:Z400'
                }, (err, res) => {
                    if (err) reject(err);
                    const rows = res.data.values;
                    var results = createResults(value[1], rows);
                    admin.database().ref('/events/' + event + '/districts').set(results)
                    resolve({
                        status: "completed"
                    })
                })
            }
        }).then((value) => {
            return value
        })
    }, (reason) => {
        console.log(reason)
        return { text: "failed"}
    })

});


