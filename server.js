var express = require('express');
var request = require('request');
var path = require('path');
var app = express();

function lastFm(method, args) {
  return `http://ws.audioscrobbler.com/2.0/?method=${method}&api_key=${API_KEY}&format=json`;
}

app.use(express.static('dist'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/index.html'));
});

app.get('/similar/:artist', (req, res) => {
  request(lastFm(`artist.getSimilar&artist=${req.params.artist}`), (error, response, body) => {
    res.send(body);
  });
});

app.listen(3000, () => {
  console.log('App listening at http://localhost:3000');
});
