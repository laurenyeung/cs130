/**
 * Client-side wrapper functions to handle communication with the back-end
 * @module
 */

// Helper function to create the callback function for the XMLHttpRequest
function createXmlHttpReqCallback(callback) {
    return function() {
        // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
        if (this.readyState != 4)
            return;

        if (this.status == 200) {
            callback(JSON.parse(this.responseText));
        }
        else {
            callback({
                success: false,
                error: "Error connecting to back-end server"
            });
        }
    };
}

/**
 * Adds a new subscription
 * @param {string} userId - ID of the user who is subscribing.
 * @param {string} platform - the platform (e.g. youtube).
 * @param {string} accountUrl - the account being subscribed to.
 * @param {function} callback - called when the operation finishes
 */
function addSubscription(userId, platform, accountUrl, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = createXmlHttpReqCallback(callback);

    // TODO: maybe make sure userId doesn't contain invalid characters?
    xhr.open("POST", "/api/" + userId);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({
        platform: platform,
        accountUrl: accountUrl
    }));
}

/**
 * Removes an existing subscription
 * @param {string} userId - ID of the user who is subscribing.
 * @param {string} platform - the platform (e.g. youtube).
 * @param {string} accountUrl - the account being subscribed to.
 * @param {function} callback - called when the operation finishes
 */
function removeSubscription(userId, platform, accountUrl, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = createXmlHttpReqCallback(callback);

    // TODO: maybe make sure userId doesn't contain invalid characters?
    xhr.open("DELETE", "/api/" + userId);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({
        platform: platform,
        accountUrl: accountUrl
    }));
}

/**
 * Gets all subscriptions of a particular user
 * @param {string} userId - ID of the user who is subscribing.
 * @param {function} callback - called when the operation finishes
 */
function getSubscriptions(userId, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = createXmlHttpReqCallback(callback);

    // TODO: maybe make sure userId doesn't contain invalid characters?
    xhr.open("GET", "/api/" + userId);
    xhr.send();
}


module.exports = {
    addSubscription: addSubscription,
    removeSubscription: removeSubscription,
    getSubscriptions: getSubscriptions
};
