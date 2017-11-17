/*jshint esversion: 6 */
/**
 * Defines the Platform interface
 * @module
 */


/**
 * Defines a single post or piece of content by a creator.
 * @typedef Content
 * @type {object}
 * @property {string} contentUrl - the URL of a particular post
 * @property {number} timestamp - the timestamp of the post
 * @property {string} platform - the platform the post is from
 */


/**
 * This class acts as the "interface" for all platforms. Since javascript does
 * not have interfaces, just return an error for everything
 */
class Platform {

    /**
     * Helper function to create the callback function for the XMLHttpRequest
     * @param  {Function} callback - The method to be called once the request returns a response.
     * @return {function} - a wrapper callback method with error handling
     */
    createXmlHttpReqCallback(callback) {
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
                    error: "API failure"
                });
            }
        };
    }

    /**
     * This method gets the content from a particular account
     * @param  {string} accountUrl - the url of the account we are getting content from
     * @return {module:client/platform~Content[]} - A list of the content grabbed from the account.
     *   See {@link module:client/platform~Content}
     */
    getContent(accountUrl) {
        throw "Platform not implemented";
    }

    /**
     * This method embeds a given url to the application at the bottom of the page.
     * @param  {String} contentUrl - the content url to be embedded
     */
    embed(contentUrl) {
        throw "Platform not implemented";
    }
}

// export the abstract Platform class from this module
module.exports = {
    Platform: Platform
};

