/*jshint esversion: 6 */

// Use youtube api here
let apiKey = "AIzaSyDQTSeTpYobZJ_dvQd_Ps_MCP90gXtjyXA";
var platform = require('./platform.js');

function formatResponse(response) {
    console.log(response);
}

/**
 * defines the Youtube implementation of the platform class
 */
class Youtube extends platform.Platform {
    
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
        // this is a test channel id
        let channelId = "UCLegnNLfivOIBlM97QUwefQ";
        let url = "https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&channelId=" + 
            channelId + "&maxResults=25&key=" + apiKey;
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = super.createXmlHttpReqCallback(formatResponse);
        xhr.open("GET", url, true);
        xhr.send();
    }

    /**
     * This method embeds a given url to the application at the bottom of the page.
     * @param  {String} contentUrl - the content url to be embedded
     */
    embed(contentUrl) {
    
    }

}

module.exports = {
    Youtube: Youtube
};