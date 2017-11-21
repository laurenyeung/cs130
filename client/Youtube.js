/*jshint esversion: 6 */

/**
 * Defined the Youtube implementation of the Platform class
 * @module
 */

// Use youtube api here
let apiKey = "AIzaSyDQTSeTpYobZJ_dvQd_Ps_MCP90gXtjyXA";
const platform = require('./platform.js');
const xhr = require('./xhr.js');

/**
 * Grabs the useful information from the api response
 * @param  {object} response - contains all of the data received from the Youtube server
 * @return {module:client/platform~Content[]} - The content contained in `response`
 */
function formatResponse(response) {
    var contentList = [];
    console.log(response);
    for(var i in response.items) {
        var item = response.items[i];
        let content = {
            'videoId': item.id.videoId, 
            'timestamp': Date.parse(item.snippet.publishedAt)/1000,
            'title': item.snippet.title,
            'description': item.snippet.description,
            'platform': "youtube"
        };
        contentList.push(content);
    }
    
    return contentList;
}

/**
 * defines the Youtube implementation of the platform class
 */
class Youtube extends platform.Platform {
    
     /**
     * This method gets the content from a particular account
     * @param  {string} accountUrl - the url of the account we are getting content from
     * @param  {module:client/platform~callback} callback - Called when the content has been
     *   retrieved. The `results` argument is of type {@link module:client/platform~Content|Content}.
     */
    getContent(accountUrl, callback) {
        let channelId = accountUrl;
        let maxResults = 5;
        let url = "https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&channelId=" + 
            channelId + "&maxResults=" + maxResults + "&key=" + apiKey;

        xhr.send("GET", url, null, (err, res) => {
            callback(err, err ? undefined : formatResponse(res));
        });
    }

    /**
     * This method embeds a given url to the application at the bottom of the page.
     * @param  {module:client/platform~Content} content - the content to be embedded
     */
    embed(content) {
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
