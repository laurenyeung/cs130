/* Unit tests for Youtube class */

var assert = require("assert");
var Youtube = require("../client/Youtube");

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
});