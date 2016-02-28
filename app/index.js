var m = require('mithril');

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

    return m('div', [
      m('form', {onsubmit: this.search}, [
        m('label', 'Author'),
        m('input', {onchange: m.withAttr('value', this.term), value: this.term()}),
        m('button[type=button]', {onclick: this.search.bind(this)}, 'Search'),
      ]),
      results.filter(resultsWithImages).map(result => {
        return m.component(Result, {
          name: result.name,
          image: result.image[2]['#text'],
          match: result.match
        });
      })
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
  },
  view: function(ctrl) {
    return m('div.result', [
      m('h3', ctrl.name),
      m('img', {src: ctrl.image}),
      m('button', {onclick: ctrl.getTracks}, 'Get Tracks'),
      m('div.tracks', [
        ctrl.tracks.map(function(track) {
          return m('p', [
            m('a', {href: 'https://www.youtube.com/results?search_query=' + ctrl.name + ' ' +track.name}, track.name)
          ]);
        })
      ])
    ]);
  }
};

function getTopTracks(artist) {
  return m.request({
    method: 'POST',
    url: '/tracks',
    data: { artist: artist }
  });
}

function resultsWithImages(result) {
  return result.image[2]['#text'];
}

m.mount(document.getElementById('testApp'), Search);
