import React from 'react';
import Pleth, { PolygonsLayer, PolygonLabelsLayer } from './pleth';
import './App.css';

const App = () => {
  const layers = [PolygonsLayer, PolygonLabelsLayer];
  return (
    <div className="App">
      <Pleth layers={layers} />
    </div>
  );
};

export default App;
