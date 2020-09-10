import React, { useMemo } from 'react';
import { feature } from 'topojson';
import { gray } from 'd3-color';
import Pleth, { PolygonsLayer, PolygonLabelsLayer } from './pleth';
import { useCensusData, parseDate } from './useCensusData';
import './App.css';

import { json } from 'd3-fetch';

// This fetches the children geometries for the given ID.
const geometryURLFromId = (id) => {
  if (id === 'USA') {
    return 'https://unpkg.com/us-atlas@3.0.0/states-10m.json';
  }
  throw new Error('Unknown ID provided: ' + id);
};

const topoFeature = async (promise) => {
  const data = await promise;
  return feature(data, data.objects.states);
};

const USStatesGeometryProvider = {
  isSupportedId: (id) => id === 'USA',
  fetchGeometriesForID: (id) => topoFeature(json(geometryURLFromId(id))),
};

const geometryProviders = [USStatesGeometryProvider];

const App = () => {
  const activeId = 'USA';
  const activeDate = parseDate('7/1/2019');

  const censusData = useCensusData(activeId);

  const activeDateData = useMemo(
    () =>
      censusData
        ? censusData.filter((d) => d.date.getTime() === activeDate.getTime())
        : null,
    [censusData, activeDate]
  );

  const fipsToDensity = useMemo(
    () =>
      activeDateData
        ? activeDateData.reduce((accumulator, d) => {
            accumulator[d.fips] = d.density;
            return accumulator;
          }, {})
        : null,
    [activeDateData]
  );
  console.log(fipsToDensity);

  const layers = [
    PolygonsLayer({
      fillStyle: (feature) => gray(feature.id),
      strokeStyle: gray(80),
    }),
    PolygonLabelsLayer,
  ];

  return (
    <div className="App">
      <Pleth
        layers={layers}
        geometryProviders={geometryProviders}
        activeId={activeId}
      />
    </div>
  );
};

export default App;
