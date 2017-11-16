/*jshint esversion: 6 */

// Use youtube api here
var platform = require('./platform.js');
var request = require('request');
var cheerio = require('cheerio');

/**
 * defines the Youtube implementation of the platform class
 */
class Youtube extends platform.Platform {
    
    /**
     * This method gets the content from a particular account
      @param  {String} accountUrl - the url of the account we are getting content from
     * @return {Object} - a list of the content grabbed from the account.
     *                    Each object in the list contains the following elements
     *                    contentUrl : the url of a particular post
     *                    timeStamp : the timestamp of the post
     *                    platform : what platform the post came from
     */
    getContent(accountUrl) {

    }

    /**
     * This method embeds a given url to the application at the bottom of the page.
     * @param  {String} contentUrl - the content url to be embedded
     */
    embed(contentUrl) {
    
    }
}