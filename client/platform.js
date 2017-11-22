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
     * The callback used for `Platform` methods
     * @callback callback
     * @param {string} error - The error message, if there was one, or `null` otherwise
     * @param {varies} results - The results of the callback if there was no error. The type
     *   of `results` varies depending on what method was called.
     */

    /**
     * This method gets the content from a particular account
     * @param  {string} accountUrl - the url of the account we are getting content from
     * @param  {module:client/platform~Content} after - Defines the piece of content to
     *   start searching after. For example, if we had previously received the first 10
     *   results in `var content`, then to get the next 10 results we would pass in `content[9]`
     *   to `after`. If `null`, then `getContent` will get the first `maxResults` results.
     * @param  {number} maxResults - The maximum number of results to return.
     * @param  {module:client/platform~callback} callback - Called when the content has been
     *   retrieved. The `results` argument is of type {@link module:client/platform~Content|Content}.
     */
    getContent(accountUrl, start, maxResults, callback) {
        throw "Platform not implemented";
    }

    /**
     * This method embeds a given url to the application at the bottom of the page.
     * @param  {module:client/platform~Content} content - the content to be embedded
     */
    embed(content) {
        throw "Platform not implemented";
    }
}

// export the abstract Platform class from this module
module.exports = {
    Platform: Platform
};

