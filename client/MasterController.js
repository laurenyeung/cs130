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

// how many results to load at a time
const RESULTS_PER_PAGE = 10;

// object keys must match up with the "platform" argument sent to/from the back-end
var Platforms = {
    youtube: new Youtube.Youtube(),
    twitter: new Twitter.Twitter(),
    tumblr:  new Tumblr.Tumblr(),
};

// keeps track of the content that has been retrieved
var contentState = {};

/**
 * Clears all retrieved content
 */
function resetContentState() {
    contentState = {
        // if this is `true`, then it means the content is currently being updated
        locked: false,

        // list of content currently being displayed
        dispContent: [],

        // content sorted by subscription
        // format:
        // {
        //   "platform:channelID": [content array],
        //   ...
        // }
        contentBySub: {},

        // for each subscription, the last Content that was displayed
        // format:
        // {
        //   "platform:channelID": {content object},
        //   ...
        // }
        last: {},

        // used to keep track of receiving content asynchronously
        subsDone: -1,
        totalSubs: -1,

        // all subscriptions, cached here so we don't have to keep calling the back-end
        subscriptions: null
    };
};

init();

function init() {
    resetContent();
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
    document.getElementById("getSubscriptionsButton").onclick = updateContent;
    document.getElementById("resetContentButton").onclick = resetContent;
    document.getElementById("logOutButton").onclick = ProfileManager.logout;
}

//These are functions called from index.html ie. by pressing a button
function callback(err, results) {
    var textOut = document.getElementById("results");
    textOut.value = err ? err : JSON.stringify(results);

    // reset content on add/remove subscription
    if (!err)
        resetContent();
}

/**
 * Called when getting subscriptions for the first time, or after the subscriptions
 * have changed.
 */
function resetContent() {
    resetContentState();

    // clear feed
    document.getElementById('contentFeed').innerHTML = '';

    // get subscriptions
    ProfileManager.getUserId(function(userId) {
        // onSubscriptionsReceived will automatically call updateContent()
        Backend.getSubscriptions(userId, onSubscriptionsReceived);
    });
}

/**
 * Called when the list of subscriptions are received from the server
 */
function onSubscriptionsReceived(err, results) {
    var textOut = document.getElementById("results");
    textOut.value = err ? err : JSON.stringify(results);
    if (err || !results.success)
        return;

    contentState.subscriptions = results.results;
    updateContent();
}

/**
 * Given a list of subscriptions, loads the next RESULTS_PER_PAGE posts
 */
function updateContent() {
    let subs = contentState.subscriptions;
    if (subs.length == 0) {
        return;
    }

    // check contentState lock
    if (contentState.locked) {
        console.error("Already updating content");
        // TODO: display visible error
        return;
    }
    contentState.locked = true;

    // setup contentState
    contentState.subsDone = 0;
    contentState.totalSubs = 0;

    // for each subscription
    for (let sub of subs) {
        // get (or create) the list of content we already have for this subscription
        let key = sub.platform + ":" + sub.accountUrl;
        let bySub = contentState.contentBySub;
        if (!bySub[key])
            bySub[key] = [];

        // if the number of posts we already have is less than RESULTS_PER_PAGE, get more
        // content until we have RESULTS_PER_PAGE posts (in the worst case, all recent
        // posts will be from a single subscription)
        let numLoaded = bySub[key].length;
        if (numLoaded < RESULTS_PER_PAGE) {
            let p = Platforms[sub.platform];
            let after = contentState.last[key] || null;
            p.getContent(sub.accountUrl, after, RESULTS_PER_PAGE - numLoaded, (err, res) => {
                onRecvContent(err, res, key);
            });

            // increment this so that onRecvContent knows when it received the content
            // for the last subscription
            contentState.totalSubs += 1;
        }
    }
}

/**
 * Callback for when content is received from a platform
 * @param {string} err - The error message if there was one
 * @param {object} res - The array of content that was received from a platform
 * @param {string} key - The key into contentState.contentBySub and contentState.last
 */
function onRecvContent(err, res, key) {
    // regardless of if there was an error, we need to increment this
    contentState.subsDone += 1;

    if (err) {
        // TODO: print an error message like "Failed to get content for..."
        // do not return here
    }
    else {
        let bySub = contentState.contentBySub;
        if (!bySub[key])
            bySub[key] = [];

        // insert in reverse sorted order (oldest first)
        res.sort((a, b) => { return a.timestamp - b.timestamp; });
        bySub[key] = res.concat(bySub[key]);
    }

    if (contentState.subsDone == contentState.totalSubs) {
        // we finally received all of the content
        contentState.subsDone = -1;
        contentState.totalSubs = -1;

        // display the content for the user
        displayContent();
    }
}

/**
 * Displays (embeds) RESULTS_PER_PAGE of the newest posts
 */
function displayContent() {
    let bySub = contentState.contentBySub;
    let newContentList = [];

    for (let i = 0; i < RESULTS_PER_PAGE; i++) {
        // find the newest piece of content and put it in newContentList
        let newest = null;

        // for each subscription
        for (let key in bySub) {
            let sub = bySub[key];
            if (sub.length == 0)
                continue;

            let content = sub[sub.length - 1];
            if (newest == null || content.timestamp > newest.content.timestamp) {
                newest = { content: content, key: key };
            }
        }

        // run out of content
        if (newest == null)
            break;

        // put the newest content in newContentList, pop from contentState.contentBySub[key]
        let newContent = bySub[newest.key].pop();
        newContentList.push(newContent);
        contentState.last[newest.key] = newContent;
    }

    // embed all of the content
    for (let content of newContentList) {
        Platforms[content.platform].embed(content);
    }

    contentState.dispContent = contentState.dispContent.concat(newContentList);
    contentState.locked = false;
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



