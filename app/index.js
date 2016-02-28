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
      results.filter(result => {
        return result.image[2]['#text'];
      }).map(result => {
        return m('div', [
          m('img', {src: result.image[2]['#text']}),
          m('strong', result.name),
          m('span', `Match: ${result.match}`)
        ]);

        // return m('div', JSON.stringify(result, null, 4));
      })
    ]);
  }
};

m.mount(document.getElementById('testApp'), Search);
