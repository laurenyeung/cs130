// test.js - Really basic tests of back-end stuff
// TODO: use a real unit testing framework
var assert = require("assert");
var dbModule = require("./database.js");

console.log("Running back-end tests...");

// helper function to run tests without using nested callbacks
function runTests(tests, current) {
    if (current >= tests.length)
        return;

    tests[current](() => { runTests(tests, current + 1); });
}

// test database creation
console.log("Creating database");
db = dbModule.createDatabase({type: "sqlite3", filename: ":memory:"}, (err) => {
    assert(err == null);

    runTests([
        testRemoveNonExisting,
        testAddSubscription,
        testRemoveSubscription
    ], 0);
});


function testRemoveNonExisting(next) {
    console.log("testRemoveNonExisting");
    db.removeSubscription("a", "a", "a", (err) => {
        assert(err != null);
        next();
    });
}

function testAddSubscription(next) {
    console.log("testAddSubscription");
    db.addSubscription("a", "a", "a", (err) => {
        assert(err == null);
        db.getSubscriptions("a", "a", (err, results) => {
            assert(results.length == 1);
            next();
        });
    });
}

function testRemoveSubscription(next) {
    console.log("testRemoveSubscription");
    db.removeSubscription("a", "a", "a", (err) => {
        assert(err == null);
        db.getSubscriptions("a", "a", (err, results) => {
            assert(results.length == 0);
            next();
        });
    });
}



