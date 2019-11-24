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
exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});

exports.updateDatabase = functions.https.onRequest((request, response) => {
    var responseBody = "Results\n";
    var scopes = [
        "https://www.googleapis.com/auth/spreadsheets.readonly"
    ];
    
    
    
    const alphaNum = (s) => {
        a = [s[0].toLowerCase().charCodeAt(0) - 97, parseInt(s[1]+s[2]+s[3]) - 1];
        return a;
    };

    const createResults = (template, data) => {
        console.log('start update')
        data
        var districts = template.districts
        for (var d in districts) {
            //d stands for districts
            for (var e in districts[d].elections) {
                for (var r in districts[d].elections[e].results) {
                    for (var v in districts[d].elections[e].results[r].votes) {
                        a = alphaNum(districts[d].elections[e].results[r].votes[v])
                        districts[d].elections[e].results[r].votes[v] = parseInt(data[a[1]][a[0]])
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
        if (request.query.f) {
            var evTemplate = admin.database().ref('/templates/' + request.query.f);
            evTemplate.once('value', (snapshot) => {
            	resolve(snapshot.val());
            })
        } else {
            reject(new Error("No Event Given"));
        }
        
    });    

    // eslint-disable-next-line promise/catch-or-return
    Promise.all([token, template]).then((value) => {
        var settings = value[1].evSettings
        var sheets = google.sheets({ version: "v4" });
        sheets.spreadsheets.values.get({
            access_token: value[0],
            spreadsheetId: settings.sheetId,
            range: settings.sheetsPageName + '!A1:Z400'
        }, (err, res) => {
            if (err) return console.log("API FAILED: " + err);
            const rows = res.data.values;
            
            response.send(createResults(value[1], rows))
            
        })
        return null;  
    }, (reason) => {
        console.log(reason)
        response.send(String(reason))
    })

});


