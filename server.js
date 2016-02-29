var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var path = require('path');
var google = require('googleapis');

var app = express();
var youtube = google.youtube('v3');

var secretsFile = './secrets.json';
var config;

try {
  config = require(secretsFile);
}
catch (err) {
  config = {};
  console.error(`Unable to read file "${secretsFile}": `, err);
  console.log("See secrets.sample.json for an example.");
}

const API_KEY = config.last_fm_api_key;
const GOOGLE_API_KEY = config.google_api_key;

function lastFm(method, args) {
  return `http://ws.audioscrobbler.com/2.0/?method=${method}&api_key=${API_KEY}&format=json`;
}

app.use(bodyParser.json());
app.use(express.static('dist'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/index.html'));
});

app.get('/similar/:artist', (req, res) => {
  request(lastFm(`artist.getSimilar&artist=${req.params.artist}`), (error, response, body) => {
    res.send(body);
  });
});

app.post('/tracks', (req, res) => {
  request(lastFm(`artist.getTopTracks&artist=${req.body.artist}&limit=3`), (error, response, body) => {
    res.send(body);
  });
});

app.post('/video', (req, res) => {
  youtube.search.list({
    q: `${req.body.artist} ${req.body.track}`,
    part: 'snippet',
    type: 'video',
    maxResults: 5,
    auth: GOOGLE_API_KEY
  }, (err, results) => {
    res.send(JSON.stringify(results));
  });
});

app.listen(3000, () => {
  console.log('App listening at http://localhost:3000');
});
