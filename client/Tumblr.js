/*jshint esversion: 6 */

/**
 * Defines the Tumblr implementation of the Platform class.
 * @module
 */

// Use Tumblr api here
const platform = require('./platform.js');
const xhr = require('./xhr.js');

/**
 * Grabs the useful information from the api response
 * @param  {object} response - contains all of the data received from the Tumblr server
 * @param  {number} offset - The index of the first response (i.e. the "offset" argument
 *   sent to the tumblr API)
 * @return {module:client/platform~Content[]} - The content contained in `response`
*/
function formatResponse(response, offset) {
    console.log(response);
    var contentList = [];
    for (let i in response.response.posts) {
        let post = response.response.posts[i];
        post.platform = "tumblr";
        post.index = offset + parseInt(i);  // typeof i is "string" for some dumb reason
        contentList.push(post);
    }

    return contentList;
}

/**
 * defines the Tumblr implementation of the platform class
 */
class Tumblr extends platform.Platform {

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
        let offset = after == null ? 0 : after.index + 1;
        var api_key = 'dwx5GBbm3Pghx2Dn8P78tfnXRSJFcYdXHNr3bpD4ffpXTzb1uD';
        var url = 'https://api.tumblr.com/v2/blog/' + accountUrl + '.tumblr.com/posts?api_key=' + 
                    api_key + '&limit=' + maxResults + "&offset=" + offset;

        xhr.send("GET", url, null, (err, res) => {
            callback(err, err ? undefined : formatResponse(res, offset));
        });
    }


    /**
     * This method embeds a given url to the application at the bottom of the page.
     * @param  {module:client/platform~Content} content - the content to be embedded
     */
    embed(content) {
        var post = '';
//        console.log(content);
        post += "--------------------"
        post += "<p>Content type: " + content.type + "</p>";
        //https://gist.github.com/interstateone/6744507
        // The post variable holds the HTML that will be placed into the page
        // Use the relevant post variables for each type from the docs
        switch (content.type) {
            case "text":
                if (this["regular-title"]) {
                    post += "<h3>" + content.title + "</h3>";
                }
                post += "<p>" + content.body + "</p>";
                break;
            case "photo":
//                console.log(content.photos[0].original_size.url);
                post += "<img src=" + content.photos[0].original_size.url + ">";
                if (content.caption) {
                    post += "<p>" + content.caption + "</p>";
                }
                break;
            case "quote":
                post += "<p>" + content.text + "</p>";
                post += "<p>" + content.source + "</p>";
                break;
            case "link":
                post += "<h3><a href='" + content.url + "'>" + content.title + "</a></h3>";
                break;
            case "chat":
                break;
            case "audio":
                post += content.embed;
                if (content.artist && content.track_name) {
                    post += "<p class='ap-info'><span class='artist'>" + content.artist + "</span> – <span class='track'>" + content.track_name + "</span></p>";
                } else if (content.track_name) {
                    post += "<p class='ap-info'><span class='track'>" + content.track_name + "</span></p>";
                }
                if (content.caption) {
                    post += "Caption:" + content.caption;
                }
                break;
            case "video":
                if (content.player[0].embed_code) {
                    post += "<p>" + content.player[0].embed_code + "</p>";
                }
                else {
                    post += "<p>Video is unavailable. May have been removed by user</p>";
                }
                if (content.caption) {
                    post += "<p>" + content.caption + "</p>";
                }
                break;
            case "answer":
                break;
            default:
                post += "Error: Unknown Tumblr post type";
        }

        let link = document.createElement('a');
        link.setAttribute('href', content.post_url);
        link.innerHTML = content.post_url;

        let timestamp = document.createElement('p');
        timestamp.innerHTML = "Timestamp: " + content.timestamp;

        let div = document.createElement('div');
        div.insertAdjacentHTML( 'beforeend', post );
        div.appendChild(link);
        div.appendChild(timestamp);
        div.setAttribute('class', 'tumblr-post');
        document.getElementById('contentFeed').appendChild(div);
    }
}

module.exports = {
    Tumblr: Tumblr
};
