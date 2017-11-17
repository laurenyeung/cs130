/*jshint esversion: 6 */

/**
 * Defined the Youtube implementation of the Platform class
 * @module
 */

// Use youtube api here
let apiKey = "AIzaSyDQTSeTpYobZJ_dvQd_Ps_MCP90gXtjyXA";
var platform = require('./platform.js');

/**
 * Grabs the useful information from the api response
 * @param  {object} response - contains all of the data received from the Youtube server
 */
function formatResponse(response) {
    var contentList = [];
    console.log(response);
    for(var i in response.items) {
        var item = response.items[i];
        let content = {
            'videoId': item.id.videoId, 
            'timestamp': item.snippet.publishedAt, 
            'title': item.snippet.title,
            'description': item.snippet.description,
            'platform': "youtube"
        };
        contentList.push(content);
    }
    // console.log(output);
    embed(contentList);
}

/**
 * Places all content in the contentList at the bottom of the webpage
 * @param  {Array} contentList - A list of the content to be embeded
 */
function embed(contentList) {
    for (let content of contentList) {
        let videoId = content.videoId;
        let title = content.title;
        let description = content.description;
        let div = document.createElement('div');
        let h3 = document.createElement('h3');
        let p = document.createElement('p');
        let iframe = document.createElement('iframe');
        h3.innerText = title;
        p.innerText = description;
        iframe.src = "https://www.youtube.com/embed/" + content.videoId;
        iframe.width = "560";
        iframe.height = "315";
        div.appendChild(h3);
        div.appendChild(p);
        div.appendChild(iframe);
        document.getElementById('contentFeed').appendChild(div);
    }
}

/**
 * defines the Youtube implementation of the platform class
 */
class Youtube extends platform.Platform {
    
     /**
     * This method gets the content from a particular account
     * @param  {string} accountUrl - the url of the account we are getting content from
     * @return {module:client/platform~Content[]} - A list of the content grabbed from the account.
     *   See {@link module:client/platform~Content}
     */
    getContent(accountUrl) {
        let channelId = accountUrl;
        let maxResults = 5;
        let url = "https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&channelId=" + 
            channelId + "&maxResults=" + maxResults + "&key=" + apiKey;
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = super.createXmlHttpReqCallback(formatResponse);
        xhr.open("GET", url, true);
        xhr.send();
    }

    // /**
    //  * This method embeds a given url to the application at the bottom of the page.
    //  * @param  {String} contentUrl - the content url to be embedded
    //  */
    // embed(contentUrl) {
    //     let iframe = document.createElement('iframe');
    //     iframe.src = "https://www.youtube.com/embed/" + contentUrl[0].videoId;
    //     iframe.width = "560";
    //     iframe.height = "315";
    //     document.body.appendChild(iframe);
    // }

}

module.exports = {
    Youtube: Youtube
};
