var express = require('express');
var app = express();

// serve the 'client' directory as static files at '/'
app.use(express.static('client'));

// serve on port 8888
app.listen(8888);

