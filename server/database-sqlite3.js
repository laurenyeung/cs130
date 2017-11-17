/*jshint esversion: 6 */

/**
 * Defines the sqlite3 implementation of the {@link Database} class
 * @module 
 */

var sqlite3 = require('sqlite3');    //.verbose(); 
var database = require('./database.js');

/**
 * Creates a new SQLite3 database. Child class of Database.
 * @class
 */
class Sqlite3Database extends database.Database {

    /**
     * Constructs an instance of SQLite3 database
     * @param {string} filename - A path to the file containing the database.
     * @param {Database~callback} callback - called when the database is ready.
     */
    constructor(filename, callback) {
        super();

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

    
    /**
     * Helper method to check if subscription is in database.
     * @param {string} userId - ID of the user who is subscribing.
     * @param {string} platform - the platform (e.g. youtube).
     * @param {string} accountUrl - the account being subscribed to.
     * @param {Database~callback} callback - called when the result has been
     *   computed. `results` is a `true` if the subscription exists, `false`
     *   otherwise.
     */
    _subscriptionExists(userId, platform, accountUrl, callback) {
        this.db.all("SELECT * FROM subscriptions WHERE userId=? AND platform=? and accountUrl=?",
            [userId, platform, accountUrl],
            (err, rows) => {
                callback(err, rows ? rows.length != 0 : undefined);
            }
        );
    }

    /**
     * Adds a subscription to the database.
     * @param {string} userId - ID of the user who is subscribing.
     * @param {string} platform - the platform (e.g. youtube).
     * @param {string} accountUrl - the account being subscribed to.
     * @param {Database~callback} callback - called when the subscription has been added
     */
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

    /**
     * Removes a subscription from the database.
     * @param {string} userId - ID of the user who is subscribing.
     * @param {string} platform - the platform (e.g. youtube).
     * @param {string} accountUrl - the account being subscribed to.
     * @param {Database~callback} callback - called when the subscription has been removed.
     * If successful, err is null, otherwise it's an error message string.
     */
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

    /**
     * Get all subscriptions for a user.
     * @param {string} userId - ID of the user who is subscribing.
     * @param {Database~callback} callback - called when finished. See 
     *   {@link Database#getSubscriptions} for more details.
     */
   
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
    /**
     * Acts as a factory method to construct an Sqlite3Database
     * @param {object} options - An object of the form `{filename: "lurkr.db"}`
     * @param {Database~callback} callback - Called once the database object
     *   has finished initializing
     */
    createDatabase: function(options, callback) {
        return new Sqlite3Database(options.filename, callback);
    },
};

