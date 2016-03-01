var m = require('mithril');

var Player = {
  view: () => {
    return m('div#player', '');
  }
};

var SearchForm = {
  term: m.prop(''),
  results: m.prop(false),
  search: function(e) {
    e.preventDefault();
    m.route('/like/' + this.term());
  },
  view: function() {
    var results = this.results() ? this.results() : [];
    var player = this.results() ? m.component(Player) : null;

    return m('div.searchForm', [
      m('form', {onsubmit: this.search}, [
        m('label', 'Author'),
        m('input', {onchange: m.withAttr('value', this.term), value: this.term()}),
        m('button[type=button]', {onclick: this.search.bind(this)}, 'Search'),
      ])
    ]);
  }
};

var SearchResults = {
  controller: function() {
    this.results = m.prop(false);

    m.request({method: 'GET', url: '/similar/' + m.route.param('artist')}).then(body => {
      this.results(body.similarartists.artist);
    });
  },
  view: function(ctrl) {
    var results = ctrl.results() ? ctrl.results() : [];
    var player = ctrl.results() ? m.component(Player) : null;

    return m('div', [
      m.component(SearchForm),
      m('div.player', [
        m('div.container', [
          m('div.responsive-embed', [
            player
          ])
        ])
      ]),
      m('div.resultsContainer', [
        results.filter(resultsWithImages).map((result, i) => {
          return m.component(Result, {
            name: result.name,
            image: result.image[2]['#text'],
            match: result.match,
            index: i,
          });
        })
      ])
    ]);
  }
}

var Result = {
  controller: function(args) {
    this.index = args.index;
    this.name = args.name;
    this.image = args.image;
    this.match = args.match;
    this.tracks = [];

    this.getTracks = function(fn) {
      m.request({
        method: 'POST',
        url: '/tracks',
        data: { artist: this.name }
      }).then(body => {
        this.tracks = body.toptracks.track;
      }).then(fn)
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

    this.initializePlayer = function(track) {
      m.request({
        method: 'POST',
        url: '/video',
        data: {artist: this.name, track: track}
      }).then(body => {
        this.updatePlayer(body.items[0].id.videoId);
      });
    }.bind(this);

    this.updatePlayer = function(id) {
      var node = document.getElementById('player');

      if (node.tagName === 'DIV') {
        window.player = new YT.Player('player', {
          videoId: id,
        });
      } else {
        window.player.loadVideoById(id);
      }
    }.bind(this);
  },
  view: function(ctrl) {
    if (ctrl.index == 0 && ctrl.tracks.length < 1) {
      ctrl.getTracks(() => {
        ctrl.initializePlayer(ctrl.tracks[0].name);
      });
    }

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

m.route.mode = 'hash';
m.route(document.getElementById('app'), '/', {
  '/': SearchForm,
  '/like/:artist': SearchResults,
});
// m.mount(document.getElementById('app'), Search);
