const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function createDocument() {
    const { window } = new JSDOM(
        `<!DOCTYPE html>
        <body>
            <div class="container-fluid">
                <div class="col-sm-9" id="lurkr-main">
                    <p>Hello world</p>
                    <div id="contentFeed">
                    </div>
                </div>
            </div>
        </body>
        </html>`
    );
    global.document = window.document;
    global.window = window;
    return document;
};

module.exports = {
    createDocument
};
