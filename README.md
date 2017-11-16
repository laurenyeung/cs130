# Lurkr

## Setup

Run this command to install node.js dependencies:
```
npm install
```

Then run this command to bundle the client-side javascript:
```
./node_modules/webpack/bin/webpack.js
```

Or, if you installed webpack globally with `npm install webpack -g`:
```
webpack
```


## Running the server
To start the server:

```
npm start
```

Then go to <http://localhost:8888> if running locally, or <http://45.79.95.161>
if running on the server. Use `npm stop` and `npm restart` to stop and restart
the server. Logs will be written to out.log and err.log.


## Directory Structure
* `client/`: Contains all front-end HTML and JavaScript code that is run in the
  the user's browser
* `server/`: Contains all back-end JavaScript (Node.JS) code that is run on the
  server
* `test/`: Contains unit tests for the back-end code
* `docs/`: Contains the documentation if it has been generated


## Documentation
To generate documentation, you first need to install jsdoc:
```
npm install -g jsdoc
```

Then simply run the provided script:
```
./generate-docs.sh
```

The generated HTML documentation will be in the `docs/` directory.


## Testing
Back-end unit tests are written using the mocha framework. To run them:
```
npm test
```


## Other

* On the cloud server, port 80 is mapped to port 8888 so node doesn't have to
  be run as root. See <https://stackoverflow.com/a/16573737>.

