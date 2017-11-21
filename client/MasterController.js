/*jshint esversion: 6 */

/**
 * The main center of control for the application. Handles user input events,
 * and initiates the retrieval of content.
 * @module
 */

const Backend = require('./backend.js');
const Youtube = require('./Youtube');
const Twitter = require('./twitter.js');
const Tumblr = require('./Tumblr.js');
const ProfileManager = require('./ProfileManager.js');

var Platforms = {
    youtube: new Youtube.Youtube(),
    twitter: new Twitter.Twitter(),
    tumblr:  new Tumblr.Tumblr(),
};

var contentState  = {
    // if this is `true`, then it means the content is currently being updated
    locked: false,

    // list of all content
    content: [],

    // used to keep track of receiving content asynchronously
    subsDone: -1,
    totalSubs: -1
};

init();

function init() {
    setButtonBehaviors();
    onPlatformChanged();    // temporary: fill in default accountUrl
    // getAllSubscriptions();
    // getContent();
    // sortContent();
}

/**
 * Sets button behavior for all buttons on the homepage
 */
function setButtonBehaviors() {
    document.getElementById("platform").onchange = onPlatformChanged;
    document.getElementById("addSubscriptionButton").onclick = onAddSub;
    document.getElementById("removeSubscriptionButton").onclick = onRemoveSub;
    document.getElementById("getSubscriptionsButton").onclick = onGetSubs;
    document.getElementById("logOutButton").onclick = ProfileManager.logout;
}

//These are functions called from index.html ie. by pressing a button
function callback(err, results) {
    var textOut = document.getElementById("results");
    textOut.value = err ? err : JSON.stringify(results);
}

function onSubscriptionsReceived(err, results) {
    if (contentState.locked) {
        callback("content locked\n"+err+"\n"+results);
        return;
    }

    callback(err, results);
    if (err || !results.success)
        return;

    //clear feed
    document.getElementById('contentFeed').innerHTML = '';

    // setup contentState
    contentState.locked = true;
    contentState.totalSubs = results.results.length;
    contentState.subsDone = 0;

    // for now, just call getContent
    // TODO: store in global array, then sort the array when done
    for (let sub of results.results) {
        Platforms[sub.platform].getContent(sub.accountUrl, onRecvContent);
    }
}

function onRecvContent(err, res) {
    // regardless of if there was an error, we need to increment this
    contentState.subsDone += 1;

    if (err) {
        // TODO: print an error message like "Failed to get content for..."
        // do not return here
    }
    else {
        // add the content to the list of content
        contentState.content = contentState.content.concat(res);
    }

    if (contentState.subsDone == contentState.totalSubs) {
        // we finally received all of the content
        contentState.subsDone = -1;
        contentState.totalSubs = -1;
        contentState.locked = false;

        // display the content for the user
        displayContent();
    }
    console.log(contentState);
}

function displayContent() {
    // TODO: sort conentState.content by timestamp

    console.log(contentState.content);

    // embed all of the content
    // TODO: only embed a few at a time, or when the user requests more
    for (let content of contentState.content) {
        Platforms[content.platform].embed(content);
    }
}

function onPlatformChanged() {
    // set a default channel for now
    const defaultAccount = {
        youtube: "UCLegnNLfivOIBlM97QUwefQ",
        tumblr: "citriccomics",
        twitter: ""
    };
    let dropDown = document.getElementById("platform");
    let accountUrl = document.getElementById("accountUrl");
    accountUrl.value = defaultAccount[dropDown.value];
}

/**
 * Called when the user wants to add a new subscription
 */
function onAddSub() {
    // TODO: verify that the channel we're subscribing to actually exists
    console.log("Clicked Add subscription button");
    ProfileManager.getUserId(function(userId) {
        var platform = document.getElementById("platform").value;
        var accountUrl = document.getElementById("accountUrl").value;
        Backend.addSubscription(userId, platform, accountUrl, callback);
    });
}

/**
 * Called when the user wants to delete an existing subscription
 */
function onRemoveSub() {
    console.log("User clicked removeSubscriptions");
    ProfileManager.getUserId(function(userId) {
        var platform = document.getElementById("platform").value;
        var accountUrl = document.getElementById("accountUrl").value;
        Backend.removeSubscription(userId, platform, accountUrl, callback);
    });
}

/**
 * Called when the user wants to retrieve their subscriptions
 */
function onGetSubs() {
    console.log("User clicked getSubscriptions");
    ProfileManager.getUserId(function(userId) {
        Backend.getSubscriptions(userId, onSubscriptionsReceived);
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
