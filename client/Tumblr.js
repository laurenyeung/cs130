/*jshint esversion: 6 */

/**
 * Defines the Tumblr implementation of the Platform class.
 * @module
 */

// Use Tumblr api here
const platform = require('./platform.js');
const xhr = require('./xhr.js');
const api_key = 'dwx5GBbm3Pghx2Dn8P78tfnXRSJFcYdXHNr3bpD4ffpXTzb1uD';
const placeholder = "Search Tumblr by Tag";

/**
 * Grabs the useful information from the api response
 * @param  {object} response - contains all of the data received from the Tumblr server
 * @param  {number} offset - The index of the first response (i.e. the "offset" argument
 *   sent to the tumblr API)
 * @return {module:client/platform~Content[]} - The content contained in `response`
*/
function formatResponse(response, offset) {
    //console.log(response);
    var contentList = [];
    for (let i in response.posts) {
        var content = {};
        content.platform = "tumblr";
        content.index = offset + parseInt(i);  // typeof i is "string" for some dumb reason
        content.post = response.posts[i];
        content.url = response.posts[i].post_url;
        content.timestamp = response.posts[i].timestamp;
        contentList.push(content);
    }

    return contentList;
}

/**
 * Grabs search suggestions from Tumblr api response and displays them on main page
 * @param {*} err - error response from Tumblr api
 * @param {*object} response - contains all of the data received from the Tumblr server 
 */
function populateSearchList(err, response) {
    //console.log(response);
    if (err) {
        console.log("Error response in Tumblr for searching by tag");
        console.log(err);
    }
    else {
        var searchList = document.getElementById('search-list');
        searchList.innerHTML = '';
        var uniqueSet = {};
        for (let i in response) {
            if (!(response[i].blog_name in uniqueSet)) {
                uniqueSet[response[i].blog_name] = true;
                var option = document.createElement('li');
                var a = document.createElement('a');
                a.setAttribute('href', '#')
                a.innerText = response[i].blog_name;
                a.onclick = function() {
                    document.getElementById('accountId').value = this.innerText;
                };
//                var textnode = document.createTextNode(response[i].blog_name);
//                option.appendChild(textnode);
                option.appendChild(a);
                searchList.appendChild(option);
            }
        }
    }
}


/**
 * defines the Tumblr implementation of the platform class
 */
class Tumblr extends platform.Platform {
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
    getContent(accountId, after, maxResults, callback) {
        //https://api.tumblr.com/v2/blog/citriccomics.tumblr.com/posts?api_key=dwx5GBbm3Pghx2Dn8P78tfnXRSJFcYdXHNr3bpD4ffpXTzb1uD&limit=20
        //api.tumblr.com/v2/blog/{blog-identifier}/posts[/type]?api_key={key}&[optional-params=]

        let offset = after == null ? 0 : after.index + 1;
        var url = 'https://api.tumblr.com/v2/blog/' + accountId + '.tumblr.com/posts?api_key=' + 
                    api_key + '&limit=' + maxResults + "&offset=" + offset;

        xhr.send("GET", url, null, (err, res) => {
            callback(err, err ? undefined : formatResponse(res.response, offset));
        });
    }


    /**
     * This method embeds a given url to the application at the bottom of the page.
     * @param  {module:client/platform~Content} content - the content to be embedded
     * @param  {object} where - a DOM element where the content should be embedded
     */
    embed(content, where) {
        var post = '';
//        console.log(content);
        //https://gist.github.com/interstateone/6744507
        // The post variable holds the HTML that will be placed into the page
        // Use the relevant post variables for each type from the docs
        switch (content.post.type) {
            case "text":
                if (this["regular-title"]) {
                    post += "<h3>" + content.post.title + "</h3>";
                }
                post += "<p>" + content.post.body + "</p>";
                break;
            case "photo":
                var photo = content.post.photos[0];
                for (let i in photo.alt_sizes) {
                    if (photo.alt_sizes[i].width < 800) {
                        post += "<img src=" + photo.alt_sizes[i].url + ">";
                        break;
                    }
                }
                if (!post) {
                    post += "<img src=" + photo.original_size.url + ">";
                }
                if (content.post.caption) {
                    post += "<p>" + content.post.caption + "</p>";
                }
                break;
            case "quote":
                post += "<p>" + content.post.text + "</p>";
                post += "<p>" + content.post.source + "</p>";
                break;
            case "link":
                post += "<h3><a href='" + content.post.url + "'>" + content.post.title + "</a></h3>";
                break;
            case "chat":
                for (let i in content.post.dialogue) {
                    post += "<p>";
                    post += "<b>" + content.post.dialogue[i].label + " </b>" + content.post.dialogue[i].phrase;
                    post += "</p>";
                }
                break;
            case "audio":
                post += content.post.embed;
                if (content.post.artist && content.post.track_name) {
                    post += "<p class='ap-info'><span class='artist'>" + content.post.artist + "</span> – <span class='track'>" + content.post.track_name + "</span></p>";
                } else if (content.post.track_name) {
                    post += "<p class='ap-info'><span class='track'>" + content.post.track_name + "</span></p>";
                }
                if (content.post.caption) {
                    post += "Caption:" + content.post.caption;
                }
                break;
            case "video":
                if (content.post.player[0].embed_code) {
                    post += "<p>" + content.post.player[0].embed_code + "</p>";
                }
                else {
                    post += "<p>Video is unavailable. May have been removed by user</p>";
                }
                if (content.post.caption) {
                    post += "<p>" + content.post.caption + "</p>";
                }
                break;
            case "answer":
                post += "<p><b>Question: </b>" + content.post.question + "</p>";
                post += "<p><b>Answer: </b>" + content.post.answer + "</p>";
                break;
            default:
                post += "Error: Unknown Tumblr post type";
        }
//        post += "<p>Content type: " + content.post.type + "</p>";

        let div = where;
        div.insertAdjacentHTML( 'beforeend', post );
        div.setAttribute('class', 'tumblr-post');
        document.getElementById('contentFeed').appendChild(div);
    }

    /**
     * This method gets the search suggestions for a particular search input
     */
    getSearch() {
        var searchText = document.getElementById('accountId').value;

        var searchList = document.getElementById('search-list');
        searchList.innerHTML = '';
        if (searchText) {
            var maxSearchSuggestions = 10;
            var url = 'https://api.tumblr.com/v2/tagged?tag=' + searchText + '&api_key=' + api_key + '&limit=' + maxSearchSuggestions;
            xhr.send("GET", url, null, (err, res) => { populateSearchList(err, res.response); });
        }
    }

    /**
     * Converts an account ID into a URL
     * @param {string} accountId - The ID of the account
     * @returns {string} The URL of the account (e.g. youtube channel)
     */
    getAccountUrl(accountId) {
        return "https://" + accountId + ".tumblr.com";
    }
}

module.exports = {
    Tumblr: Tumblr
};
