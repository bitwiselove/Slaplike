import React from 'react';
import { render } from 'react-dom';

const ArtistSearchForm = ({
  onSearchClick
}) => {
  let input;

  return (
    <div>
      <input type="text" ref={node => {
        input = node;
      }} />
      <input type="submit" value="Search" onClick={() => {
        onSearchClick(input.value);
        input.value = '';
      }} />
    </div>
  );
};

const App = () => (
  <div>
    <h1>Slaplike</h1>
    <ArtistSearchForm
      onSearchClick={artist => {
        alert(artist);
      }}
    />
  </div>
);

render(
  <App />,
  document.getElementById('app')
);
