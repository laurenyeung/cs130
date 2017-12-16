/* Unit tests for Youtube class */

var assert = require("assert");
var Youtube = require("../client/Youtube");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const DocumentCreator = require('./createDocument.js');

describe('Youtube', () => {

	let youtube = new Youtube.Youtube();

	describe('formatResponse', () => {
		it('should return an array of content objects created from the response argument', () => {
			let response = {
				"items": [
				  {
				   "id": {
					"videoId": "testVideoId"
				   },
				   "snippet": {
					"publishedAt": "2017-12-13T00:00:03.000Z",
					"title": "testVideoTitle",
					"description": "testVideoDescription",
					"channelTitle": "testChannelTitle",
				   }
				  }
			  	]
			}
			let contentList = Youtube.formatResponse(response);
			let expectedResult = [
				{
					'videoId': "testVideoId",
					'url': "https://youtube.com/watch?v=testVideoId",
					'timestamp': 1513123203,
					'title': "testVideoTitle",
					'description': "testVideoDescription",
					'platform': "youtube",
					'accountName': "testChannelTitle"
				}
			]
			assert.deepEqual(contentList, expectedResult);
		});
	});

	describe('getPlaceHolder', () => {
		it('should return the correct placeholder text', () => {
			assert.equal(youtube.getPlaceholder(), "Search Youtube by Username");
		});
	});

	describe('#embed()', () => {
		it('should embed the given platform content into the main page', () => {
		let content = {
			'videoId': "testVideoId",
			'url': "https://youtube.com/watch?v=testVideoId",
			'timestamp': 1513123203,
			'title': "testVideoTitle",
			'description': "testVideoDescription",
			'platform': "youtube",
			'accountName': "testChannelTitle"
		};

		var document = DocumentCreator.createDocument();
		let div = document.createElement("div");
		youtube.embed(content, div);
		let contentFeed = document.getElementById("contentFeed");

		//Get the string representation of contentFeed
		var tmp = document.createElement("div");
		tmp.appendChild(contentFeed);
		var actual = tmp.innerHTML;

		var expected = `<div id="contentFeed"><div><h5></h5><iframe src="https://www.youtube.com/embed/testVideoId" width="560" height="315"></iframe><p></p></div></div>`;

		//Remove whitespaces then compare actual and expected
		assert.deepEqual(actual.replace(/\s+/g, ''), expected.replace(/\s+/g, ''));
		});
	});
});