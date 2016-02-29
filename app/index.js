var m = require('mithril');

var Player = {
  view: () => {
    return m('div#player', '');
  }
};

var Search = {
  term: m.prop(''),
  results: m.prop(false),
  search: function(e) {
    e.preventDefault();

    m.request({method: 'GET', url: '/similar/' + Search.term()}).then(body => {
      Search.results(body.similarartists.artist);
    }).then(m.redraw);
  },
  view: function() {
    var results = this.results() ? this.results() : [];
    var player = this.results() ? m.component(Player) : null;

    return m('div', [
      m('form', {onsubmit: this.search}, [
        m('label', 'Author'),
        m('input', {onchange: m.withAttr('value', this.term), value: this.term()}),
        m('button[type=button]', {onclick: this.search.bind(this)}, 'Search'),
      ]),
      m('div.playerContainer', [
        player
      ]),
      m('div.resultsContainer', [
        results.filter(resultsWithImages).map(result => {
          return m.component(Result, {
            name: result.name,
            image: result.image[2]['#text'],
            match: result.match
          });
        })
      ])
    ]);
  }
};

var Result = {
  controller: function(args) {
    this.name = args.name;
    this.image = args.image;
    this.match = args.match;
    this.tracks = [];

    this.getTracks = function() {
      m.request({
        method: 'POST',
        url: '/tracks',
        data: { artist: this.name }
      }).then(body => {
        this.tracks = body.toptracks.track;
      }).then(m.redraw)
    }.bind(this);

    this.youtubeFor = function(event) {
      event.preventDefault();

      var artist = this.name;
      var track = event.target.getAttribute('data-track');

      m.request({
        method: 'POST',
        url: '/video',
        data: {artist: artist, track: track}
      }).then(body => {
        this.updatePlayer(body.items[0].id.videoId);
      }).then(m.redraw);
    }.bind(this);

    this.updatePlayer = function(id) {
      var node = document.getElementById('player');

      if (node.tagName === 'DIV') {
        window.player = new YT.Player('player', {
          videoId: id
        });
      } else {
        window.player.loadVideoById(id);
      }
    }.bind(this);
  },
  view: function(ctrl) {
    return m('div.result', [
      m('h3', ctrl.name),
      m('img', {src: ctrl.image}),
      m('button', {onclick: ctrl.getTracks}, 'Get Tracks'),
      m('div.tracks', [
        ctrl.tracks.map(function(track) {
          return m('p', [
            m('a', {href: '#', onclick: ctrl.youtubeFor, 'data-track': track.name}, track.name)
          ]);
        })
      ])
    ]);
  }
};

function resultsWithImages(result) {
  return result.image[2]['#text'];
}

m.mount(document.getElementById('testApp'), Search);
