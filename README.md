# Lurkr

## Setup

Run this command to install node.js dependencies:

```
npm install
```


## Running the server
To start the server:

```
npm start
```

Then go to <http://localhost:8888> if running locally, or <http://45.79.95.161>
if running on the server. Use `npm stop` and `npm restart` to stop and restart
the server. Logs will be written to out.log and err.log.


## Testing
Back-end unit tests are written using the mocha framework. To run them:

```
npm test
```

The back-end unit tests are located in the test/ directory.


## Other

* Front-end stuff goes in the "client" directory, back-end in "server"
* On the cloud server, port 80 is mapped to port 8888 so node doesn't have to
  be run as root. See <https://stackoverflow.com/a/16573737>.

