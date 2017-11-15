// platform-youtube.js - defines the Youtube implementation of the platform class 
// Use youtube api here
var platform = require('./platform.js');

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