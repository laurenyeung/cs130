/*jshint esversion: 6 */

// platform-twitter.js - defines the Twitter implementation of the platform class 
// Use twitter api here
var platform = require('./platform.js');
const xhr = require('./xhr.js');
const api_key = 'jlTC5jlmNIzBIZNLHReXfP8uS';
const placeholder = "Search Twitter by Username";
// var request = require('request');
// var cheerio = require('cheerio');

class Twitter extends platform.Platform {
    /**
     * Return the placeholder text that should appear in the search bar for a specific placeholder
     * @returns {String} - Platform's placeholder txt
     */
    getPlaceholder() {
        return placeholder;
    }

    /**
     * This method gets the content from a particular account
     * @param  {string} accountId - the ID of the account we are getting content from
     * @param  {module:client/platform~Content} after - Defines the piece of content to
     *   start searching after. For example, if we had previously received the first 10
     *   results in `var content`, then to get the next 10 results we would pass in `content[9]`
     *   to `after`. If `null`, then `getContent` will get the first `maxResults` results.
     * @param  {number} maxResults - The maximum number of results to return.
     * @param  {module:client/platform~callback} callback - Called when the content has been
     *   retrieved. The `results` argument is of type {@link module:client/platform~Content|Content}.
     */
    getContent(accountId, start, maxResults, callback) {
        throw "Platform not implemented";
    }

    /**
     * This method embeds a given url to the application at the bottom of the page.
     * @param  {module:client/platform~Content} content - the content to be embedded
     * @param  {object} where - a DOM element where the content should be embedded
     */
    embed(content, where) {
        throw "Platform not implemented";
    }

    /**
     * Converts an account ID into a URL
     * @param {string} accountId - The ID of the account
     * @param  {module:client/platform~callback} callback - This function is called when the channel Id has been
     *   retrieved. The `results` argument is of type {string}
     */
    getAccountUrl(accountId) {
        callback(null, "https://twitter.com/" + accountId);
    }
}

module.exports = {
    Twitter: Twitter
};
