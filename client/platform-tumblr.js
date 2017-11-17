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
    for (let i in response.response.posts) {
        let post = response.response.posts[i];
        contentList.push(post);
    }
    embed(contentList);
}

/**
 * Places all content in the contentList at the bottom of the webpage
 * @param  {Array} contentList - A list of the content to be embedded
 */
function embed(contentList) {
    for (let i in contentList) {
        var post = '';

        //https://gist.github.com/interstateone/6744507
        // The post variable holds the HTML that will be placed into the page
        // Use the relevant post variables for each type from the docs
        switch (contentList[i].type) {
            case "text":
                if (this["regular-title"]) {
                post += "<h3>" + contentList[i].title + "</h3>";
            }
                post += "<p>" + contentList[i].body + "</p>";
                break;
            case "link":
                post = "<h3><a href='" + contentList[i].url + "'>" + contentList[i].title + "</a></h3>";
                break;
            case "quote":
                post = "<p>" + contentList[i].text + "</p>";
                break;
            case "photo":
                console.log(contentList[i].photos[0].original_size.url);
                post = "<img src=" + contentList[i].photos[0].original_size.url + ">";
                if (contentList[i].caption) {
                    post += "<p>" + contentList[i].caption + "</p>";
                }
                break;
            case "video":
                post = contentList[i].player.embed_code + "<p>" + contentList[i].caption + "</p>";
                break;
            case "audio":
                post = contentList[i].embed;
                if (contentList[i].artist && contentList[i].track_name) {
                    post += "<p class='ap-info'><span class='artist'>" + contentList[i].artist + "</span> – <span class='track'>" + contentList[i].track_name + "</span></p>";
                } else {
                    if (contentList[i].track_name) {
                    post += "<p class='ap-info'><span class='track'>" + contentList[i].track_name + "</span></p>";
                    }
                }
                if (contentList[i].caption) {
                    post += contentList[i].caption;
                }
                break;
        }

        let link = document.createElement('a');
        link.setAttribute('href', contentList[i].post_url);
        link.innerHTML = contentList[i].post_url;

        let timestamp = document.createElement('p');
        timestamp.innerHTML = "Timestamp: " + contentList[i].timestamp;

        let div = document.createElement('div');
        div.insertAdjacentHTML( 'beforeend', post );
        div.appendChild(link);
        div.appendChild(timestamp);
        div.setAttribute('class', 'tumblr-post');
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