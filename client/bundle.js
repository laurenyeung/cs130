/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/*jshint esversion: 6 */

const Backend = __webpack_require__(1);
const Youtube = __webpack_require__(2);

var Platforms = [ Youtube ]; //Add all platforms here
var youtubeContent;
var twitterContent;
var tumblrContent;
var content;
var sortedContent;

init();

function init() {
    setButtonBehaviors();
    setTestVideoContent();
    // getAllSubscriptions();
    // getContent();
    // sortContent();
}

/**
 * Sets button behavior for all buttons on the homepage
 */
function setButtonBehaviors() {
    document.getElementById("addSubscriptionButton").onclick = onAddSub;
    document.getElementById("removeSubscriptionButton").onclick = onRemoveSub;
    document.getElementById("getSubscriptionsButton").onclick = onGetSubs;
}

function setTestVideoContent() {
    document.getElementById("testVideo").src = "https://www.youtube.com/embed/dQw4w9WgXcQ?&autoplay=1";
}

//These are functions called from index.html ie. by pressing a button
function callback(results) {
    var textOut = document.getElementById("results");
    textOut.value = JSON.stringify(results);
}

function onAddSub() {
    console.log("Clicked Add subsrciption button");
    var userId = document.getElementById("userId").value;
    var platform = document.getElementById("platform").value;
    var accountUrl = document.getElementById("accountUrl").value;
    Backend.addSubscription(userId, platform, accountUrl, callback);
}

function onRemoveSub() {
    console.log("User clicked removeSubscriptions");
    var userId = document.getElementById("userId").value;
    var platform = document.getElementById("platform").value;
    var accountUrl = document.getElementById("accountUrl").value;
    Backend.removeSubscription(userId, platform, accountUrl, callback);
}

function onGetSubs() {
    console.log("User clicked getSubscriptions");
    var userId = document.getElementById("userId").value;
    var platform = document.getElementById("platform").value;
    Backend.getSubscriptions(userId, platform, callback);
    document.getElementById("results").value = "User clicked getSubscriptions";
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

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// backend.js - Client-side javascript to handle communication with the back-end

// Helper function to create the callback function for the XMLHttpRequest
function createXmlHttpReqCallback(callback) {
    return function() {
        // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
        if (this.readyState != 4)
            return;

        if (this.status == 200) {
            callback(JSON.parse(this.responseText));
        }
        else {
            callback({
                success: false,
                error: "Error connecting to back-end server"
            });
        }
    };
}

// Adds a new subscription
// Arguments:
//   userId, platform, accountUrl - see server/database.js
//   callback(results) - callback function, where results is:
//       {
//           success: true/false,
//           error: "Error message if failed"
//       }
function addSubscription(userId, platform, accountUrl, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = createXmlHttpReqCallback(callback);

    // TODO: maybe make sure userId doesn't contain invalid characters?
    xhr.open("POST", "/api/" + userId);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({
        platform: platform,
        accountUrl: accountUrl
    }));
}

// Removes a subscription
// Arguments: same as addSubscription
function removeSubscription(userId, platform, accountUrl, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = createXmlHttpReqCallback(callback);

    // TODO: maybe make sure userId doesn't contain invalid characters?
    xhr.open("DELETE", "/api/" + userId);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({
        platform: platform,
        accountUrl: accountUrl
    }));
}

// Gets the subscriptions for a user
// Arguments:
//   userId - see server/database.js
//   callback(results) - callback function, results is:
//       {
//           success: true/false,
//           error: "Error message if failed",
//           results: [ { platform: "...", accountUrl: "..." }, {...} ]
//       }
function getSubscriptions(userId, platform, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = createXmlHttpReqCallback(callback);

    // TODO: maybe make sure userId doesn't contain invalid characters?
    xhr.open("GET", "/api/" + userId + "/" + platform);
    xhr.send();
}


module.exports = {
    addSubscription: addSubscription,
    removeSubscription: removeSubscription,
    getSubscriptions: getSubscriptions
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/*jshint esversion: 6 */

// platform-youtube.js - defines the Youtube implementation of the platform class 
// Use youtube api here
var platform = __webpack_require__(3);

class Youtube extends platform.Platform {
    getUrl() {
        return "https://youtube.com/user/";
        //return "https://www.youtube.com/embed/VIDEO_ID"
    }

    embed() {
        throw "Platform not implemented";
    }

    scrape() { 
        throw "Platform not implemented";
    }
}

/***/ }),
/* 3 */
/***/ (function(module, exports) {

// platform.js - Defines the Platform superclass

// This class acts as the "interface" for all platforms. Since javascript does
// not have interfaces, just return an error for everything
class Platform {

    getUrl() {
        throw "Platform not implemented";
    }

    embed() {
        throw "Platform not implemented";
    }

    scrape() {
        throw "Platform not implemented";
    }
}

// export the abstract Platform class from this module
module.exports = {
    Platform: Platform
}



/***/ })
/******/ ]);