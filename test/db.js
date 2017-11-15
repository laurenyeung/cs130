// db.js - Unit test for the Database class
var assert = require("assert");
var dbModule = require("../server/database.js");

// helper function to just call done with err if there is one
function shouldSucceed(done) {
    return (err) => {
        if (err) done(err);
        else done();
    };
}

// helper function to call done with success if there is an err
function shouldFail(done) {
    return (err) => {
        if (err) done();
        else done("Should have failed");
    };
}

describe('Database', () => {
    var db = null;

    it('should create the database without error', (done) => {
        db = dbModule.createDatabase({type: "sqlite3", filename: ":memory:"}, shouldSucceed(done));
    });

    describe('#addSubscription()', () => {
        it('should successfully add a non-existant subscription', (done) => {
            db.addSubscription("a", "a", "a", (err) => {
                // clean up
                db.removeSubscription("a", "a", "a", (err) => {});

                shouldSucceed(done)(err);
            });
        });

        it('should fail to add an already existing subscription', (done) => {
            db.addSubscription("a", "a", "a", (err) => {
                db.addSubscription("a", "a", "a", (err) => {
                    // clean up
                    db.removeSubscription("a", "a", "a", (err) => {});

                    shouldFail(done)(err);
                });
            });
        });
    });

    describe('#removeSubscription()', () => {
        it('should fail to remove a non-existant subscription', (done) => {
            db.removeSubscription("a", "a", "a", shouldFail(done)); 
        });
        it('should successfully remove a subscription that exists', (done) => {
            db.addSubscription("a", "a", "a", (err) => {
                db.removeSubscription("a", "a", "a", shouldSucceed(done));
            });
        });
    });

    describe('#getSubscriptions()', ()=> {
        it('should return an empty list if there are no subscriptions for a user', (done) => {
            db.getSubscriptions("blahblahblah", "", (err, res) => {
                assert(res && res.length == 0);
                done(err);
            });
        });

        it('should return all added subscriptions', (done) => {
            db.addSubscription("user", "a", "a", (err) => {
                if (err) done(err);
                db.addSubscription("user", "b", "b", (err) => {
                    if (err) done(err);
                    db.getSubscriptions("user", "", (err, res) => {
                        if (err) done(err);

                        assert(res && res.length == 2);
                        assert(res[0].platform == "a" || res[0].platform == "b");
                        assert(res[1].platform == "a" || res[1].platform == "b");
                        assert(res[0].platform != res[1].platform);
                        assert(res[0].platform == res[0].accountUrl);
                        assert(res[1].platform == res[1].accountUrl);

                        done();
                    });
                });
            });
        });
    });
});

