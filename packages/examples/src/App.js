import React from 'react';
import Pleth, { PolygonsLayer, PolygonLabelsLayer } from './pleth';
import './App.css';

import { json } from 'd3-fetch';

// This fetches the children geometries for the given ID.
const geometryURLFromId = (id) => {
  if (id === 'USA') {
    return 'https://unpkg.com/us-atlas@3.0.0/states-10m.json';
  }
  throw new Error('Unknown ID provided: ' + id);
};

const USStatesDataProvider = {
  isSupportedId: (id) => id === 'USA',
  fetchGeometriesForID: (id) => json(geometryURLFromId(id)),
};

const App = () => {
  const layers = [PolygonsLayer, PolygonLabelsLayer];
  const dataProviders = [USStatesDataProvider];
  return (
    <div className="App">
      <Pleth layers={layers} dataProviders={dataProviders} activeId="USA" />
    </div>
  );
};

export default App;
