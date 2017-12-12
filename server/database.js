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
     * @callback callback
     * @param {string} err - The error message if there was an error, or `null` otherwise.
     * @param {object} results - Additional results, if applicable. For operations that
     *   only have a success/fail result, this is `undefined`.
     */

    /**
     * Adds a subscription to the database.
     * @param {string} userId - ID of the user who is subscribing.
     * @param {string} platform - the platform (e.g. youtube).
     * @param {string} accountId - the account being subscribed to.
     * @param {module:server/database~callback} callback - Called when the database operation
     *   finishes
     */
    addSubscription(userId, platform, accountId, callback) {
        throw "Not implemented";
    }

    /**
     * Removes a subscription from the database.
     * @param {string} userId - ID of the user who is subscribing.
     * @param {string} platform - the platform (e.g. youtube).
     * @param {string} accountId - the account being subscribed to.
     * @param {module:server/database~callback} callback - Called when the database operation
     *   finishes
     */
    removeSubscription(userId, platform, accountId, callback) {
        throw "Not implemented";
    }

    /**
     * Gets all subscriptions for a particular user.
     * @param {string} userId - ID of the user who is subscribing.
     * @param {module:server/database~callback} callback - called once all subscriptions have been
     *   retrieved. If successful, `results` is an array of objects
     *   `{platform: "...", accountId: "..."}`, otherwise it's `undefined`.
     */
    getSubscriptions(userId, callback) {
        throw "Not implemented";
    }
}

module.exports = {
    Database: Database,

    /**
     * Acts as a factory method for constructing Databases. Also encapsulates
     * loading the module containing the database implementation.
     * @param {object} options - An object of the form:
     * ```
     * {
     *   type: "sqlite3|mysql",
     *   // implementation specific options go here
     *   filename: "lurkr.db"
     * }
     * ```
     */
    createDatabase: function(options, callback) {
        module = require("./database-"+options.type+".js");
        return module.createDatabase(options, callback);
    }
};

