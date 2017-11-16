/*jshint esversion: 6 */

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
            'description': item.snippet.description,
            'title': item.snippet.title,
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
    for (var i in contentList) {
        let div = document.createElement('div');
        let iframe = document.createElement('iframe');
        iframe.src = "https://www.youtube.com/embed/" + contentList[i].videoId;
        iframe.width = "560";
        iframe.height = "315";
        iframe.style = "text-align:center";
        iframe.setAttribute('allowFullScreen', '');

        let h3 = document.createElement('h3');
        h3.innerHTML = contentList[i].title;

        let ul2 = document.createElement('ul');
        ul2.innerHTML = contentList[i].description;
        div.appendChild(h3);
        div.appendChild(ul2);
        div.appendChild(iframe);
        document.body.appendChild(div);
    }
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