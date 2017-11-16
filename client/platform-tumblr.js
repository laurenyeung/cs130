/*jshint esversion: 6 */

// Use Tumblr api here
const platform = require('./platform.js');
//const request = require('request-promise')

/**
 * Grabs the useful information from the api response
 * @param  {object} response - contains all of the data received from the Tumblr server
*/
function formatResponse(response) {
    var contentList = [];
    console.log(response);
    for (let i in response.response.posts) {
        let post = response.response.posts[i];
        console.log(post);
        let oneContent = { 'contentUrl': post.post_url, 'timestamp': post.timestamp, 'platform': 'Tumblr'};
        contentList.push(oneContent);
    }
    embed(contentList);
}

/**
 * Places all content in the contentList at the bottom of the webpage
 * @param  {Array} contentList - A list of the content to be embedded
 */
function embed(contentList) {
    for (let i in contentList) {
        let div = document.createElement('div');
        let node = document.createElement('a');
        node.setAttribute('class', 'tumblr-post');
        node.setAttribute('href', contentList[i].contentUrl);
        node.innerHTML = contentList[i].contentUrl + " Timestamp: " + contentList[i].timestamp;
        div.appendChild(node);
        document.body.appendChild(div);
    }
}

/**
 * defines the Tumblr implementation of the platform class
 */
class Tumblr extends platform.Platform {

    /**
     * This method gets the content from a particular account
     * @param  {String} accountUrl - the url of the account we are getting content from
     * @return {Object} - a list of the content grabbed from the account.
     *                    Each object in the list contains the following elements
     *                    contentUrl : the url of a particular post
     *                    timeStamp : the timestamp of the post
     *                    platform : what platform the post came from
     */
    getContent(accountUrl) {
        //https://api.tumblr.com/v2/blog/citriccomics.tumblr.com/posts?api_key=dwx5GBbm3Pghx2Dn8P78tfnXRSJFcYdXHNr3bpD4ffpXTzb1uD&limit=20
        //api.tumblr.com/v2/blog/{blog-identifier}/posts[/type]?api_key={key}&[optional-params=]
        /*
        const options = {
            method: 'GET',
            uri: 'https://api.tumblr.com/v2/blog/' + accountUrl + '.tumblr.com/posts',
            qs: {
                api_key: dwx5GBbm3Pghx2Dn8P78tfnXRSJFcYdXHNr3bpD4ffpXTzb1uD,
                limit: 20
            },
            json: true
        }

        request(options)
        .then(function (response) {
            // Request was successful, use the response object at will
            console.log(response);
            if (response.statusCode == 200) {
                return { "platform": "tumblr", "content": response.response.posts }
            }
            else {
                console.log("Status code from Tumblr was " + response.statusCode);
                throw "Error getting content from Tumblr";
            }
        })
        .catch(function (err) {
            // Something bad happened, handle the error
            throw "Error getting content from Tumblr";
        })
        */
        var api_key = 'dwx5GBbm3Pghx2Dn8P78tfnXRSJFcYdXHNr3bpD4ffpXTzb1uD';
        var limit = 20;
        var url = 'https://api.tumblr.com/v2/blog/' + accountUrl + '.tumblr.com/posts?api_key=' + 
                    api_key + '&limit=' + limit;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = super.createXmlHttpReqCallback(formatResponse);
        xhr.open("GET", url, false);
        xhr.send();
    }


}

module.exports = {
    Tumblr: Tumblr
};