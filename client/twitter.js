/*jshint esversion: 6 */

// platform-youtube.js - defines the Youtube implementation of the platform class 
// Use youtube api here
var platform = require('./platform.js');
// var request = require('request');
// var cheerio = require('cheerio');

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

class Twitter extends platform.Platform {
    embed() {
        throw "Platform not implemented";
    }

    scrape() {
        throw "Platform not implemented"
    }
}

module.exports = {
    Twitter: Twitter
};