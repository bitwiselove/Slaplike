import React from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';
import { createStore } from 'redux';

const initialState = [];

function artistsReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_ARTIST':
      return [
        ...state,
        action.artist
      ];
    default:
      return state;
  }
}

let store = createStore(artistsReducer);

const ArtistList = ({ artists }) => (
  <div>
    <h1>Artists</h1>
    {artists.map(artist => {
      <h2>{artist.name}</h2>
    })}
  </div>
);

const mapStateToProps = (state) => {
  return {
    artists: state
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onArtistClick: (id) => {
      console.log('clicky');
    }
  }
}

const VisibleArtistList = connect(
  mapStateToProps,
  mapDispatchToProps
)(ArtistList);

class SearchForm extends React.Component {
  constructor() {
    super();

    this.state = {
      value: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    alert(this.state.value);
  }

  render() {
    return (
      <div>
        <h2>Search Form</h2>
        <input type="text" value={this.state.value} onChange={this.handleChange} />
        <button type="button" onClick={this.handleSubmit}>Search</button>
      </div>
    );
  }
}

const App = () => (
  <div>
    <SearchForm />
    <VisibleArtistList />
  </div>
);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);


/*
   const state = {
term: 'lil b',
artists: [
{
name: 'Gucci Mane',
bio: 'Maybe this...?',
tracks: [
{
title: 'Something',
youtubeId: 'xD-123khl'
},
{
title: 'Something',
youtubeId: 'xD-123khl'
},
]
},
]
}
*/
