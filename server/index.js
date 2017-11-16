var express = require('express');
var bodyParser = require('body-parser');
var daemon = require('start-stop-daemon');

// initialize express
var app = express();

// allow us to get the JSON request bodies
app.use(bodyParser.json());

// serve the 'client' directory as static files at '/'
app.use(express.static('client', {index:false}));

// route '/' to either /index.html or /login.html depending on weather or not
// the user is logged in
app.get('/', (req, res) => {
    // assume that the user is logged in if they have a cookie beginning with
    // "fbsr_"
    let cookie = req.headers.cookie;
    if (!cookie || !cookie.match(/fbsr_.+/)) {
        res.redirect("/login.html");
    }
    else {
        res.redirect("/index.html");
    }
});

// initialize the database
var db = require("./database.js").createDatabase(
    { type: "sqlite3", filename: "lurkr.db" },
    (err) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log("Successfully initialized database connection");
    });


// GET /api/:userId: gets the list of subscriptions for a user
// Returns the following JSON:
// {
//     success: true/false,
//     error: "error message if success was false",
//     results: [ { platform: "youtube, accountUrl: "..." }, {...} ] // only if successful
// }
/** 
 * Returns JSON with success, error, and results.
 */
app.get('/api/:userId', (req, res) => {
    db.getSubscriptions(req.params["userId"], (err, subs) => {
        if (err) {
            res.send({
                success: false,
                error: err
            });
        }
        else {
            res.send({
                success: true,
                results: subs
            });
        }
    });
});

// POST /api/:userId: adds a new subscription for a user
// The body of the request should be JSON of the following form:
// {
//     "platform": "youtube",
//     "accountUrl": "http://..."
// }
// The response will be JSON of the following form:
// {
//     "success": true/false,
//     "error": "Error message if failed"
// }
/** 
 * Returns JSON with success and error.
 */
app.post('/api/:userId', (req, res) => {
    var platform = req.body.platform;
    var accountUrl = req.body.accountUrl;
    if (!platform || !accountUrl) {
        res.send({
            success: false,
            error: "Invalid request body"
        });
    }
    else {
        db.addSubscription(req.params["userId"], platform, accountUrl, (err) => {
            if (err) {
                res.send({
                    success: false,
                    error: err
                });
            }
            else {
                res.send({ success: true });
            }
        });
    }
});

// DELETE /api/:userId: removes a subscription for a user
// The body of the request and the response will both be similar to those of
// the add subscription request above.
/** 
 * Removes subscription for a user.
 */
app.delete('/api/:userId', (req, res) => {
    var platform = req.body.platform;
    var accountUrl = req.body.accountUrl;
    if (!platform || !accountUrl) {
        res.send({
            success: false,
            error: "Invalid request body"
        });
    }
    else {
        db.removeSubscription(req.params["userId"], platform, accountUrl, (err) => {
            if (err) {
                res.send({
                    success: false,
                    error: err
                });
            }
            else {
                res.send({ success: true });
            }
        });
    }
});

// serve on port 8888
daemon(() => {
    app.listen(8888);
});

