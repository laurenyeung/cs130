/*jshint esversion: 6 */

/**
 * Defines the abstract {@link Database} "interface" class
 * @module 
 */

/**
 * Creates a new Database. Acts as parent class for all databases.
 * Javascript does not have interfaces, only returns errors for everything.
 * @class
 */
class Database {

    /**
     * @callback Database~callback
     * @param {string} err - The error message if there was an error, or `null` otherwise.
     * @param {object} results - Additional results, if applicable. For operations that
     *   only have a success/fail result, this is `undefined`.
     */
  
    /**
     * Adds a subscription to the database.
     * @param {number} userId - ID of the user who is subscribing.
     * @param {number} platform - the platform (e.g. youtube).
     * @param {number} accountUrl - the account being subscribed to.
     * @param {Database~callback} callback - Called when the database operation finishes
     */
    addSubscription(userId, platform, accountUrl, callback) {
        throw "Not implemented";
    }

    /**
     * Removes a subscription from the database.
     * @param {number} userId - ID of the user who is subscribing.
     * @param {number} platform - the platform (e.g. youtube).
     * @param {number} accountUrl - the account being subscribed to.
     * @param {Database~callback} callback - Called when the database operation finishes
     */
    removeSubscription(userId, platform, accountUrl, callback) {
        throw "Not implemented";
    }

    /**
     * Gets all subscriptions for a particular user.
     * @param {number} userId - ID of the user who is subscribing.
     * @param {Database~callback} callback - called once all subscriptions have been
     *   retrieved. If successful, `results` is an array of objects 
     *   `{platform: "...", accountUrl: "..."}`, otherwise it's `undefined`.
     */
    getSubscriptions(userId, callback) {
        throw "Not implemented";
    }
}

module.exports = {
    Database: Database,

    // acts sort of like a factory method, but also hides the module loading
    // callback is called on error, or when the database is ready
    createDatabase: function(options, callback) {
        module = require("./database-"+options.type+".js");
        return module.createDatabase(options, callback);
    }
};

