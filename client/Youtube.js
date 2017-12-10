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
     * @param  {module:client/platform~Content} after - Defines the piece of content to
     *   start searching after. For example, if we had previously received the first 10
     *   results in `var content`, then to get the next 10 results we would pass in `content[9]`
     *   to `after`. If `null`, then `getContent` will get the first `maxResults` results.
     * @param  {number} maxResults - The maximum number of results to return.
     * @param  {module:client/platform~callback} callback - Called when the content has been
     *   retrieved. The `results` argument is of type {@link module:client/platform~Content|Content}.
     */
    getContent(accountUrl, after, maxResults, callback) {
        let channelId = accountUrl;
        let url = "https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&channelId=" + 
            channelId + "&maxResults=" + maxResults + "&key=" + apiKey;
        if (after != null)
            url += "&publishedBefore=" +
                encodeURIComponent(new Date((after.timestamp - 1)*1000).toISOString());

        xhr.send("GET", url, null, (err, res) => {
            callback(err, err ? undefined : formatResponse(res));
        });
    }

    /**
     * This method embeds a given url to the application at the bottom of the page.
     * @param  {module:client/platform~Content} content - the content to be embedded
     * @param  {object} where - a DOM element where the content should be embedded
     */
    embed(content, where) {
        let videoId = content.videoId;
        let description = content.description;
        let div = where;
        let title = document.createElement('h5');
        let p = document.createElement('p');
        let iframe = document.createElement('iframe');
        title.innerText = content.title;
        p.innerText = description;
        iframe.src = "https://www.youtube.com/embed/" + content.videoId;
        iframe.width = "560";
        iframe.height = "315";
        div.appendChild(title);
        div.appendChild(iframe);
        div.appendChild(p);
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
