/* Unit tests for Tumblr class */

var assert = require("assert");
var Tumblr = require("../client/Tumblr.js");
const DocumentCreator = require('./createDocument.js');

var response = {
    "blog": {
        "name": "test",
        "title": "Basketball Videos",
        "total_posts": 3,
        "updated": 1426502674,
        "url": "http://test.tumblr.com/",
    },
    "posts": [
        {
            "type": "video",
            "blog_name": "test",
            "id": 113776881077,
            "post_url": "http://test.tumblr.com/post/113776881077",
            "timestamp": 1426502674,
            "permalink_url": "https://www.youtube.com/watch?v=xPFJIHE3E54",
            "video": {
                "youtube": {
                    "video_id": "xPFJIHE3E54",
                    "width": 540,
                    "height": 304
                }
            },
            "player": [
                {
                    "width": 250,
                    "embed_code": "<iframe width=\"250\" height=\"141\"  id=\"youtube_iframe\" src=\"https://www.youtube.com/embed/xPFJIHE3E54?feature=oembed&amp;enablejsapi=1&amp;origin=https://safe.txmblr.com&amp;wmode=opaque\" frameborder=\"0\" gesture=\"media\" allow=\"encrypted-media\" allowfullscreen></iframe>"
                }
            ],
            "video_type": "youtube",
        }]
}

var post =
    {
        "type": "video",
        "blog_name": "test",
        "id": 113776881077,
        "post_url": "http://test.tumblr.com/post/113776881077",
        "timestamp": 1426502674,
        "permalink_url": "https://www.youtube.com/watch?v=xPFJIHE3E54",
        "video": {
            "youtube": {
                "video_id": "xPFJIHE3E54",
                "width": 540,
                "height": 304
            }
        },
        "player": [
            {
                "width": 250,
                "embed_code": "<iframe width=\"250\" height=\"141\"  id=\"youtube_iframe\" src=\"https://www.youtube.com/embed/xPFJIHE3E54?feature=oembed&amp;enablejsapi=1&amp;origin=https://safe.txmblr.com&amp;wmode=opaque\" frameborder=\"0\" gesture=\"media\" allow=\"encrypted-media\" allowfullscreen></iframe>"
            }
        ],
        "video_type": "youtube",
    };


describe('Tumblr', () => {
    let tumblr = new Tumblr.Tumblr();
    
    describe('#getPlaceHolder()', () => {
        it('should return the correct placeholder text', () => {
            assert.equal(tumblr.getPlaceholder(), "Search Tumblr by Tag");
        });
    });

    describe('#formatResponse()', () => {
        it('should return an array of content objects created from the response argument', () => {
            let contentList = Tumblr.formatResponse(response, 0);
            let expectedResult = [
                {
                    'index': 0,
                    'platform': "tumblr",
                    'url': "http://test.tumblr.com/post/113776881077",
                    'timestamp': 1426502674,
                    'post': post
                }
            ]
            assert.deepEqual(contentList, expectedResult);
        });
    });

    describe('#embed()', () => {
        it('should  embed the given platform content into the main page', () => {
            let content = {
                'index': 0,
                'platform': "tumblr",
                'url': "http://test.tumblr.com/post/113776881077",
                'timestamp': 1426502674,
                'post': post
            };

            var document = DocumentCreator.createDocument();
            let div = document.createElement("div");
            tumblr.embed(content, div);
            let contentFeed = document.getElementById("contentFeed");

            //Get the string representation of contentFeed
            var tmp = document.createElement("div");
            tmp.appendChild(contentFeed);
            //Remove newlines and tabs
            //var actual = tmp.innerHTML.split('\t').join('');
            //actual = actual.split('\n').join('');
            var actual = tmp.innerHTML;

            var expected = `<div id="contentFeed"><div class="tumblr-post"><p><iframe width="250" height="141" id="youtube_iframe" src="https://www.youtube.com/embed/xPFJIHE3E54?feature=oembed&amp;enablejsapi=1&amp;origin=https://safe.txmblr.com&amp;wmode=opaque" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen=""></iframe></p></div></div>`;

            assert.deepEqual(actual.replace(/\s+/g, ''), expected.replace(/\s+/g, ''));
        });
    });

});