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

// const WebScraper = require('./Scraper.js');
// const Backend = require('./backend.js');
const Youtube = __webpack_require__(1);

var Platforms = [ Youtube ]; //Add all platforms here
var youtubeContent;
var twitterContent;
var tumblrContent;
var content;
var sortedContent;

init();

function init() {
    setButtonBehaviors();
    // getAllSubsriptions();
    // getContent();
    // sortContent();
}

/**
 * Sets button behavior for all buttons on the homepage
 */
function setButtonBehaviors() {
    let addSubscriptionButton = document.getElementById("addSubscriptionButton")
    addSubscriptionButton.onClick = onAddSub;
    let removeSubscriptionButton = document.getElementById("removeSubscriptionButton")
    removeSubscriptionButton.onClick = onRemoveSub;
    let getSubscriptionsButton = document.getElementById("getSubscriptionsButton")
    getSubscriptionsButton.onClick = onGetSubs;
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
    document.getElementById("results").value = "User clicked getSubscriptions";
    console.log("User clicked getSubscriptions");
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
/***/ (function(module, exports, __webpack_require__) {

/*jshint esversion: 6 */

// platform-youtube.js - defines the Youtube implementation of the platform class 
// Use youtube api here
var platform = __webpack_require__(2);

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
/* 2 */
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

// export the abstract Database class from this module
module.exports = {
    Platform: Platform,
}



/***/ })
/******/ ]);