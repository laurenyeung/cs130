// backend.js - Client-side javascript to handle communication with the back-end

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

// Adds a new subscription
// Arguments:
//   userId, platform, accountUrl - see server/database.js
//   callback(results) - callback function, where results is:
//       {
//           success: true/false,
//           error: "Error message if failed"
//       }
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

// Removes a subscription
// Arguments: same as addSubscription
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

// Gets the subscriptions for a user
// Arguments:
//   userId - see server/database.js
//   callback(results) - callback function, results is:
//       {
//           success: true/false,
//           error: "Error message if failed",
//           results: [ { platform: "...", accountUrl: "..." }, {...} ]
//       }
function getSubscriptions(userId, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = createXmlHttpReqCallback(callback);

    // TODO: maybe make sure userId doesn't contain invalid characters?
    xhr.open("GET", "/api/" + userId);
    xhr.send();
}

