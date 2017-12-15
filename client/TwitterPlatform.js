/*jshint esversion: 6 */

// platform-twitter.js - defines the Twitter implementation of the platform class 
// Use twitter api here
var platform = require('./platform.js');
var Twitter = require('twitter-node-client').Twitter;
const xhr = require('./xhr.js');
const placeholder = "Search Twitter by Username";

var config = {
        "consumerKey": "jlTC5jlmNIzBIZNLHReXfP8uS",
       "consumerSecret": "dNIE3oFVdIFCz4ZVbTMpks9P6tOcIk1Hr6lrM0k2xG6dLyc4A7",
       "accessToken": "931011969699557376-XgvNxi5W4N1qcAYnk6XBi9P431vBh2O",
       "accessTokenSecret": "mAZ94v83r4E36GfDTcgiicDB6pcZ7pQqrDo5KFYLkyGS0",
       "callBackUrl": ""
    }


//Callback functions
    var error = function (err, response, body) {
    console.log('ERROR [%s]', JSON.stringify(err));
    console.log("twitter failure");
};
    var success = function (data) {
        console.log('Data [%s]', data);
    };

class TwitterPlatform extends platform.Platform {
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
        
        //GET https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=twitterapi&count=2
      //  var url = 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=' + accountId + '&count=5';

       // xhr.send("GET", url, null, (err, res) => {
        //    callback(err, err ? undefined : formatResponse(res.response, offset));

        var twitter = new Twitter(config);
        twitter.getUserTimeline({ screen_name: 'realDonaldTrump', count: maxResults}, error, success);
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
     * @returns {string} The URL of the account (e.g. youtube channel)
     */
    getAccountUrl(accountId) {
        return "https://twitter.com/" + accountId;
    }
}

module.exports = {
    TwitterPlatform: TwitterPlatform
};
