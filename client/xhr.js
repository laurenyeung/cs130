/*jshint esversion: 6 */

/**
 * Helpers to make using XmlHTTPRequest less painful to use
 * @module
 */

/**
 * The callback used for createXhr
 * @callback callback
 * @param {string} error - The error message, if there was one, or `null` otherwise. Note
 *   that just because `error` is `null` does not mean that the server did not also return
 *   an error. In this case, `error` only indicates an error connecting to the server,
 *   so you should also check `results` for any indication of a failure.
 * @param {object} results - The results of the XMLHttpRequest, or `undefined` if there
 *   was an error. Currently, all responses are assumed to be JSON.
 */

/**
 * Helper function to create the callback function for the XMLHttpRequest
 * @param  {module:client/xhr~callback} callback - The method to be called once the request
 *   returns a response.
 * @return {function} - a wrapper callback function that can be used as an 
 *   `XMLHttpRequest.onreadystatechange` callback.
 */
function createXhrCallback(callback) {
    return function() {
        // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
        if (this.readyState != 4)
            return;

        if (this.status == 200) {
            // for the time being, assume everyone returns JSON
            callback(null, JSON.parse(this.responseText));
        }
        else {
            callback("HTTP request failed with status " + this.status);
        }
    };
}

/**
 * Creates and sends an XMLHttpRequest
 * @param {string} url - The URL of the request
 * @param {varies} body - The body of the HTTP request. If this is a string, it will be
 *   sent directly as-is. If this is an object, it will be converted to JSON. Otherwise, no
 *   body is sent.
 * @param {module:client/xhr~callback} callback - Called when a response is received
 * @return {XMLHttpRequest} - The XMLHttpRequest that was created
 */
function send(method, url, body, callback) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = createXhrCallback(callback);
    xhr.open(method, url, true);
    if (typeof(body) === "object") {
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(body));
    }
    else if (typeof(body) === "string")
        xhr.send(body);
    else
        xhr.send();
}

module.exports = {
    send: send
};

