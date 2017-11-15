let WebScraper = require('./client/Scraper');

let youtubeSubscriptions;
let twitterSubscriptions;
let tumblrSubscriptions;

let youtubeContent;
let twitterContent;
let tumblrContent;
let content;
let sortedContet;

getSubscriptions();
getContent();
sortContent();

function: getSubscriptions();

function: getContent() {
	youtubeContent = WebScraper.scrape('Youtube', youtubeSubscriptions);
	twitterContent = WebScraper.scrape('Twitter', twitterSubscriptions);
	tumblrContent = WebScraper.scrape('Tumblr', tumblrSubscriptions);
	content = [youtubeContent, twitterContent, tumblrContent];
}


function: sortContent() {
	sortedContent = sort(content);
}