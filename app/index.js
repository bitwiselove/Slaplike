var m = require('mithril');

var Search = {
  term: m.prop(''),
  results: m.prop(false),
  search: function(e) {
    e.preventDefault();
    var artist = Search.term();

    m.request({method: 'GET', url: '/similar/' + artist}).then(body => {
      Search.results(body.similarartists.artist);
    }).then(m.redraw);
  },
  view: function() {
    console.log(this.results());
    var results = this.results() ? this.results() : [];

    return m('div', [
      m('form', {onsubmit: this.search}, [
        m('label', 'Author'),
        m('input', {onchange: m.withAttr('value', this.term), value: this.term()}),
        m('button[type=button]', {onclick: this.search.bind(this)}, 'Search'),
      ]),
      results.map(result => {
        return m('div', result.name);
      })
    ]);
  }
};

m.mount(document.getElementById('testApp'), Search);
