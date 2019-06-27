var express = require('express');
var cors = require('cors');
var browserify = require('browserify-middleware');
const axios = require('axios');


var app = express();

// your manifest must have appropriate CORS headers, you could also use '*'
app.use(cors({ origin: '*' }));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

app.use('/fonts', express.static('./fonts'));

app.set('view engine', 'ejs');


// optimization of javascript
// https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/javascript-startup-optimization/

//provide a browserified file at a path
app.get('/js/client.js', browserify(__dirname + '/client/client.js'));

app.get('/js/modal.js', browserify(__dirname + '/client/modal.js'));



// http://expressjs.com/en/starter/basic-routing.html
app.get("*", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
