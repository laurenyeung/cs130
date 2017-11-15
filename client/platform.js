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

