/*jshint esversion: 6 */
// database.js - Defines the Database "interface" class

/**
 * Creates a new Database. Acts as parent class for all databases.
 * Javascript does not have interfaces, only returns errors for everything.
 * @class
 */
class Database {

  
    /**
     * Adds a subscription to the database.
     * @param {number} userId - ID of the user who is subscribing.
     * @param {number} platform - the platform (e.g. youtube).
     * @param {number} accountUrl - the account being subscribed to.
     * @param {error} callback - called when the subscription has been added. If successful, err is null, otherwise it's an error message string.
     */
    addSubscription(userId, platform, accountUrl, callback) {
        throw "Not implemented";
    }

    /**
     * Removes a subscription from the database.
     * @param {number} userId - ID of the user who is subscribing.
     * @param {number} platform - the platform (e.g. youtube).
     * @param {number} accountUrl - the account being subscribed to.
     * @param {error} callback - called when the subscription has been added.
     * If successful, err is null, otherwise it's an error message string.
     */
    removeSubscription(userId, platform, accountUrl, callback) {
        throw "Not implemented";
    }

    /**
     * Gets all subscriptions for a particular user.
     * @param {number} userId - ID of the user who is subscribing.
     * @param {number} platform - the platform (e.g. youtube).
     * @param {error} callback - called when the subscription has been added. If
     *       successful, err is null, and subs is:
     *       [ { platform: "youtube", accountUrl: "http://youtube.com/channel/123blah456" }, {...} ]
     *       otherwise, err is an error message string, and subs is null.
     */
    getSubscriptions(userId, platform, callback) {
        throw "Not implemented";
    }
}

    /**
     * Exports abstract database class from this module
     * @module 
     */
module.exports = {
    Database: Database,

    // acts sort of like a factory method, but also hides the module loading
    // callback is called on error, or when the database is ready
    createDatabase: function(options, callback) {
        module = require("./database-"+options.type+".js");
        return module.createDatabase(options, callback);
    }
};

