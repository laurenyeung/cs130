/*jshint esversion: 6 */
// platform.js - Defines the Platform superclass

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
      @param  {String} accountUrl - the url of the account we are getting content from
     * @return {Object} - a list of the content grabbed from the account.
     *                    Each object in the list contains the following elements
     *                    contentUrl : the url of a particular post
     *                    timeStamp : the timestamp of the post
     *                    platform : what platform the post came from
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

