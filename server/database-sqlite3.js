/*jshint esversion: 6 */
// database-sqlite3.js - defines the sqlite3 implementation of the database class 

var sqlite3 = require('sqlite3');    //.verbose(); 
var database = require('./database.js');

class Sqlite3Database extends database.Database {
    constructor(filename, callback) {
        super();

        // open or create the database
        this.db = new sqlite3.Database(filename, (err) => {
            if (err)
                return callback(err);

            // turn on serialized mode to prevent other queries from going
            // through before the database is ready
            this.db.serialize();

            // get all tables named "subscriptions"
            this.db.all("SELECT name FROM sqlite_master WHERE type='table' AND name='subscriptions'",
            (err, rows) => {
                if (err)
                    return callback(err);

                if (rows.length == 0) {
                    // create the subscriptions table
                    this.db.run(`CREATE TABLE subscriptions(
                        userId     TEXT,
                        platform   TEXT,
                        accountUrl TEXT,

                        UNIQUE(userId, platform, accountUrl)
                    )`);

                    // create an index on userId for faster access
                    this.db.run("CREATE INDEX idx1 ON subscriptions(userId)");
                    this.db.run("CREATE INDEX idx2 ON subscriptions(userId, platform, accountUrl)",
                        (err) => {
                            // should now be safe to parallelize
                            this.db.parallelize();
                            callback(err);
                        });
                }
            });
        });
    }

    // helper method to figure out if a subscription exists
    _subscriptionExists(userId, platform, accountUrl, callback) {
        this.db.all("SELECT * FROM subscriptions WHERE userId=? AND platform=? and accountUrl=?",
            [userId, platform, accountUrl],
            (err, rows) => {
                callback(err, rows ? rows.length != 0 : undefined);
            }
        );
    }

    addSubscription(userId, platform, accountUrl, callback) {
        this._subscriptionExists(userId, platform, accountUrl, (err, exists) => {
            // return error if subscription already exists
            if (exists) {
                return callback("Subscription already exists");
            }

            // add the subscription
            this.db.run("INSERT INTO subscriptions(userId, platform, accountUrl) VALUES(?, ?, ?)",
                [userId, platform, accountUrl],
                (err) => {
                    callback(err ? "Database error: " + err : null);
                }
            );
        });
    }

    removeSubscription(userId, platform, accountUrl, callback) {
        this._subscriptionExists(userId, platform, accountUrl, (err, exists) => {
            // return error if subscription already exists
            if (!exists) {
                return callback("Subscription does not exist");
            }

            // remove the subscription
            this.db.run("DELETE FROM subscriptions WHERE userId=? AND platform=? AND accountUrl=?",
                [userId, platform, accountUrl],
                (err) => {
                    callback(err ? "Database error: " + err : null);
                }
            );
        });
    }

    // TODO: platform ignored for now, still need to figure out specifics of the API
    getSubscriptions(userId, callback) {
        this.db.all("SELECT platform, accountUrl FROM subscriptions WHERE userId=?", [userId],
            (err, rows) => {
                if (err)
                    callback("Database error: " + err);
                else
                    callback(null, rows);
            }
        );
    }
}

module.exports = {
    // acts as a factory method
    createDatabase: function(options, callback) {
        return new Sqlite3Database(options.filename, callback);
    },
};

