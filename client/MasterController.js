const WebScraper = require('./Scraper.js');
const Backend = require('./backend.js');

var Platforms = [ new Youtube ]; //Add all platforms here
var youtubeContent;
var twitterContent;
var tumblrContent;
var content;
var sortedContent;

init();

function init() {
    setButtonBehaviors();
    getAllSubsriptions();
    getContent();
    sortContent();
}

/**
 * Sets button behavior for all buttons on the homepage
 */
function setButtonBehaviors() {
    document.getElementById("addSubscriptionButton").onClick = onAddSub;
    document.getElementById("removeSubscriptionButton").onClick = onRemoveSub;
    document.getElementById("getSubscriptionsButton").onClick = onGetSubs;
}

//These are functions called from index.html ie. by pressing a button
function callback(results) {
    var textOut = document.getElementById("results");
    textOut.value = JSON.stringify(results);
}

function onAddSub() {
    var userId = document.getElementById("userId").value;
    var platform = document.getElementById("platform").value;
    var accountUrl = document.getElementById("accountUrl").value;
    addSubscription(userId, platform, accountUrl, callback);
}

function onRemoveSub() {
    var userId = document.getElementById("userId").value;
    var platform = document.getElementById("platform").value;
    var accountUrl = document.getElementById("accountUrl").value;
    removeSubscription(userId, platform, accountUrl, callback);
}

function onGetSubs() {
    var userId = document.getElementById("userId").value;
    //var platform = document.getElementById("platform").value;
    getSubscriptions(userId, callback);
}

function onLoad() {
    /*
    for (content in sortedContent) {
        //Display embedded stuff here?
    }
    */
}

// These are functions for scraping
/*
function getContent() {
	youtubeContent = WebScraper.scrape('Youtube', youtubeSubscriptions);
	twitterContent = WebScraper.scrape('Twitter', twitterSubscriptions);
	tumblrContent = WebScraper.scrape('Tumblr', tumblrSubscriptions);
	content = [youtubeContent, twitterContent, tumblrContent];
}
*/

function getAllContent(userId) {
    let allContent;
    for (platform in Platforms) {
        getSubscriptions(userId, platform, (err, res) => {
            if (err) {
                throw "Error getting subsriptions from backend";
            }
            else {
                let platformContent = platform.scrape(platformSubscription);
                allContent.push(platformContent);
            }
        });
    }
}

function sortContent() {
//	sortedContent = sort(content);
}