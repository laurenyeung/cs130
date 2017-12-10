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

        // content that hasn't been displayed yet, sorted by subscription
        // format:
        // {
        //   "platform:channelID": [content array sorted by oldest first],
        //   ...
        // }
        newContentQueues: {},

        // for each subscription, the last Content that was displayed
        // format:
        // {
        //   "platform:channelID": {content object},
        //   ...
        // }
        lastDisplayed: {},

        // used to keep track of receiving content asynchronously
        subsDone: -1,
        totalSubs: -1,

        // all subscriptions, cached here so we don't have to keep calling the back-end
        subscriptions: null
    };
};

function init() {
    resetContent();
    setButtonBehaviors();
    onPlatformChanged();    // temporary: fill in default accountUrl
    // getAllSubscriptions();
    // getContent();
    // sortContent();
}

// Have ProfileManager call init() once facebook is done loading. Do this
// because we need the facebook ID before we can get subscriptions
ProfileManager.setInitCallback(init);

/**
 * Sets button behavior for all buttons on the homepage
 */
function setButtonBehaviors() {
    document.getElementById("platform").onchange = onPlatformChanged;
    document.getElementById("addSubscriptionButton").onclick = onAddSub;
    document.getElementById("removeSubscriptionButton").onclick = onRemoveSub;
    document.getElementById("getSubscriptionsButton").onclick = updateContent;
    document.getElementById("logOutButton").onclick = ProfileManager.logout;
}

//These are functions called from index.html ie. by pressing a button
function callback(err, results) {
    // TODO: display error to the user if there was one
    if (err)
        console.error(err);
    else
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
    if (err || !results.success) {
        console.error(err ? err : JSON.stringify(results));
        return;
    }

    contentState.subscriptions = results.results;
    updateContent();
}

/**
 * Given a list of subscriptions, loads the next RESULTS_PER_PAGE posts
 */
function updateContent() {
    let subs = contentState.subscriptions;
    if (subs.length == 0) {
        let contentFeed = document.getElementById("contentFeed");
        contentFeed.innerHTML = "<p>You don't have any subscriptions!</p>";
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
        let queues = contentState.newContentQueues;
        if (!queues[key])
            queues[key] = [];

        // if the number of posts we already have is less than RESULTS_PER_PAGE, get more
        // content until we have RESULTS_PER_PAGE posts (in the worst case, all recent
        // posts will be from a single subscription)
        let numLoaded = queues[key].length;
        if (numLoaded < RESULTS_PER_PAGE) {
            let p = Platforms[sub.platform];
            let after = contentState.lastDisplayed[key] || null;
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
 * @param {string} key - The key into contentState.newContentQueues and contentState.lastDisplayed
 */
function onRecvContent(err, res, key) {
    // regardless of if there was an error, we need to increment this
    contentState.subsDone += 1;

    if (err) {
        // TODO: print an error message like "Failed to get content for..."
        // do not return here
    }
    else {
        let queues = contentState.newContentQueues;
        if (!queues[key])
            queues[key] = [];

        // insert in reverse sorted order (oldest first)
        res.sort((a, b) => { return a.timestamp - b.timestamp; });
        queues[key] = res.concat(queues[key]);
    }

    if (contentState.subsDone == contentState.totalSubs) {
        // we finally received all of the content
        contentState.subsDone = -1;
        contentState.totalSubs = -1;

        // display the content for the user
        displayNewContent();
    }
}

/**
 * Displays (embeds) RESULTS_PER_PAGE of the newest posts
 */
function displayNewContent() {
    let queues = contentState.newContentQueues;
    let newContentList = [];

    for (let i = 0; i < RESULTS_PER_PAGE; i++) {
        // find the newest piece of content and put it in newContentList
        let newest = null;

        // for each subscription
        for (let key in queues) {
            let q = queues[key];
            if (q.length == 0)
                continue;

            let content = q[q.length - 1];
            if (newest == null || content.timestamp > newest.content.timestamp) {
                newest = { content: content, key: key };
            }
        }

        // run out of content
        if (newest == null)
            break;

        // put the newest content in newContentList, pop from queues[key]
        let newContent = queues[newest.key].pop();
        newContentList.push(newContent);
        contentState.lastDisplayed[newest.key] = newContent;
    }

    // embed all of the content
    for (let content of newContentList) {
        addContentToWindow(content);
    }

    contentState.dispContent = contentState.dispContent.concat(newContentList);
    contentState.locked = false;
}

// adds one piece of content
function addContentToWindow(content) {
    let contentFeed = document.getElementById("contentFeed");

    let outer = document.createElement("div");
    outer.className = "lurkr-content";

    // <h3>title</h3>
    let title = document.createElement("h3");
    if (content.title)
        title.innerHTML = content.title;
    else
        title.innerHTML = "[title unknown]";

    // <div>[embedded stuff goes here]</div>
    let inner = document.createElement("div");
    Platforms[content.platform].embed(content, inner);

    // <p>Sun Dec 10 2017 (3 hours ago)</p>
    let time = document.createElement("p");
    time.className = "lurkr-timeStr";
    time.innerHTML = createTimeStr(content.timestamp);

    outer.appendChild(title);
    outer.appendChild(inner);
    outer.appendChild(time);

    contentFeed.appendChild(outer);
}

// given a timestamp, outputs a string of the form:
// [day-of-week] [month] [day] [year] (x [seconds/minutes/hours/days/years] ago)
function createTimeStr(timestamp) {
    let a = new Date(timestamp * 1000);
    let timeStr = a.toDateString();

    function makeAgoStr(n, s) {
        return String(n) + " " + s + (n == 1 ? "" : "s") + " ago";
    }

    let agoStr;
    let now = new Date().getTime() / 1000;
    let diff = now - timestamp;
    if (diff < 120)
        agoStr = "just now";
    else if (diff < 3600)
        agoStr = makeAgoStr(Math.floor(diff/60), "minute");
    else if (diff < 3600*24)
        agoStr = makeAgoStr(Math.floor(diff/3600), "hour");
    else
        agoStr = makeAgoStr(Math.floor(diff/86400), "day");

    return "Published " + timeStr + " (" + agoStr + ")";
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
    if (dropDown.value != "")
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



