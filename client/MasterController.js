/*jshint esversion: 6 */

const Backend = require('./backend.js');
const Youtube = require('./Youtube');
const Twitter = require('./twitter.js');
const Main = require('./main.js');

var Platforms = { 'Youtube': new Youtube.Youtube(), 'Twitter': new Twitter.Twitter() }; //Add all platforms here
var youtubeContent;
var twitterContent;
var tumblrContent;
var content;
var sortedContent;

init();

function init() {
    setButtonBehaviors();
    setTestVideoContent();
    Platforms.Youtube.getContent();
    // getAllSubscriptions();
    // getContent();
    // sortContent();
}

/**
 * Sets button behavior for all buttons on the homepage
 */
function setButtonBehaviors() {
    //using addsubscriptionbutton for testing
    // document.getElementById("addSubscriptionButton").onclick = Platforms.Youtube.getContent;
    document.getElementById("addSubscriptionButton").onclick = onAddSub;
    document.getElementById("removeSubscriptionButton").onclick = onRemoveSub;
    document.getElementById("getSubscriptionsButton").onclick = onGetSubs;
    document.getElementById("logOutButton").onclick = Main.logout;
}

/**
 * A testing method used to dynamically set the content of the embeded video
 */
function setTestVideoContent() {
    // never gonna give you up...
    // document.getElementById("testVideo").src = "https://www.youtube.com/embed/dQw4w9WgXcQ";
}

//These are functions called from index.html ie. by pressing a button
function callback(results) {
    var textOut = document.getElementById("results");
    textOut.value = JSON.stringify(results);
}

function onAddSub() {
    console.log("Clicked Add subscription button");
    Main.getUserId(function(userId) {
        var platform = document.getElementById("platform").value;
        var accountUrl = document.getElementById("accountUrl").value;
        Backend.addSubscription(userId, platform, accountUrl, callback);
    });
}

function onRemoveSub() {
    console.log("User clicked removeSubscriptions");
    Main.getUserId(function(userId) {
        var platform = document.getElementById("platform").value;
        var accountUrl = document.getElementById("accountUrl").value;
        Backend.removeSubscription(userId, platform, accountUrl, callback);
    });
}

function onGetSubs() {
    console.log("User clicked getSubscriptions");
    Main.getUserId(function(userId) {
        Backend.getSubscriptions(userId, callback);
        document.getElementById("results").value = "User clicked getSubscriptions";
    });
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

/**
 * Not used yet...
 */
// function getAllContent(userId) {
//     let allContent;
//     for (var platform in Platforms) {
//         getSubscriptions(userId, platform, (err, res) => {
//             if (err) {
//                 throw "Error getting subsriptions from backend";
//             }
//             else {
//                 let platformContent = platform.scrape(platformSubscription);
//                 allContent.push(platformContent);
//             }
//         });
//     }
// }

/**
 * Not used yet...
 * @return {[type]} [description]
 */
// function sortContent() {
//	sortedContent = sort(content);
// }