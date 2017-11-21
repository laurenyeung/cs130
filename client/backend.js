/**
 * Client-side wrapper functions to handle communication with the back-end
 * @module
 */

const xhr = require("./xhr.js");

/**
 * Adds a new subscription
 * @param {string} userId - ID of the user who is subscribing.
 * @param {string} platform - the platform (e.g. youtube).
 * @param {string} accountUrl - the account being subscribed to.
 * @param {function} callback - called when the operation finishes
 */
function addSubscription(userId, platform, accountUrl, callback) {
    let body = {
        platform: platform,
        accountUrl: accountUrl
    };
    xhr.send("POST", "/api/" + userId, body, callback);
}

/**
 * Removes an existing subscription
 * @param {string} userId - ID of the user who is subscribing.
 * @param {string} platform - the platform (e.g. youtube).
 * @param {string} accountUrl - the account being subscribed to.
 * @param {function} callback - called when the operation finishes
 */
function removeSubscription(userId, platform, accountUrl, callback) {
    let body = {
        platform: platform,
        accountUrl: accountUrl
    };
    xhr.send("DELETE", "/api/" + userId, body, callback);
}

/**
 * Gets all subscriptions of a particular user
 * @param {string} userId - ID of the user who is subscribing.
 * @param {function} callback - called when the operation finishes
 */
function getSubscriptions(userId, callback) {
    xhr.send("GET", "/api/" + userId, null, callback);
}


module.exports = {
    addSubscription: addSubscription,
    removeSubscription: removeSubscription,
    getSubscriptions: getSubscriptions
};
