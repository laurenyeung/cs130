// database.js - Defines the Database "interface" class

// This class acts as the "interface" for all databases. Since javascript does
// not have interfaces, just return an error for everything
class Database {
    // Adds a subscription to the database
    //
    // Arguments:
    //   userId - ID of the user who is subscribing
    //   platform - the platform (e.g. youtube)
    //   accountUrl - the account being subscribed to
    //   callback(err) - called when the subscription has been added. If
    //       successful, err is null, otherwise it's an error message string.
    addSubscription(userId, platform, accountUrl, callback) {
        throw "Not implemented";
    }

    // Removes a subscription from the database
    //
    // Arguments:
    //   userId - ID of the user who is subscribing
    //   platform - the platform (e.g. youtube)
    //   accountUrl - the account being subscribed to
    //   callback(err) - called when the subscription has been added. If
    //       successful, err is null, otherwise it's an error message string.
    removeSubscription(userId, platform, accountUrl, callback) {
        throw "Not implemented";
    }

    // Gets all subscriptions for a particular user
    //
    // Arguments:
    //   userId - ID of the user who is subscribing
    //   platform - the platform (e.g. youtube)
    //   callback(err, subs) - called when the subscription has been added. If
    //       successful, err is null, and subs is:
    //       [ { platform: "youtube", accountUrl: "http://youtube.com/channel/123blah456" }, {...} ]
    //       otherwise, err is an error message string, and subs is null.
    getSubscriptions(userId, platform, callback) {
        throw "Not implemented";
    }
}

// export the abstract Database class from this module
module.exports = {
    Database: Database,

    // acts sort of like a factory method, but also hides the module loading
    // callback is called on error, or when the database is ready
    createDatabase: function(options, callback) {
        module = require("./database-"+options.type+".js");
        return module.createDatabase(options, callback);
    }
};

