import React, { useMemo } from 'react';
import { feature } from 'topojson';
import { scaleSequentialLog } from 'd3-scale';
import { max } from 'd3-array';
import { gray } from 'd3-color';
import { interpolateGreys } from 'd3-scale-chromatic';
import Pleth, { PolygonsLayer, PolygonLabelsLayer, useURLState } from './pleth';
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

const activeDate = parseDate('7/1/2019');
const colorValue = (d) => d.density;

const urlStateConfig = {
  activeId: {
    name: 'id',
    defaultValue: 'USA',
    parse: (d) => d,
    stringify: (d) => d,
  },
};

const urlStateReducer = (state, action) => {
  switch (action.type) {
    case 'setActiveId':
      return { ...state, activeId: action.activeId };
    default:
      throw new Error();
  }
};

const App = () => {
  const [urlState] = useURLState(urlStateConfig, urlStateReducer);
  const { activeId } = urlState;
  console.log(activeId);

  const censusData = useCensusData(activeId);

  const activeDateData = useMemo(
    () =>
      censusData
        ? censusData.filter((d) => d.date.getTime() === activeDate.getTime())
        : null,
    [censusData]
  );

  const colorScale = useMemo(
    () =>
      activeDateData
        ? scaleSequentialLog(
            [1, max(activeDateData, colorValue)],
            interpolateGreys
          )
        : null,
    [activeDateData]
  );

  const fipsToColorValue = useMemo(
    () =>
      activeDateData
        ? activeDateData.reduce((accumulator, d) => {
            accumulator[d.fips] = colorValue(d);
            return accumulator;
          }, {})
        : null,
    [activeDateData]
  );

  const layers = useMemo(
    () => [
      PolygonsLayer({
        fillStyle: (feature) =>
          fipsToColorValue ? colorScale(fipsToColorValue[feature.id]) : 'white',
        strokeStyle: gray(80),
      }),
      PolygonLabelsLayer,
    ],
    [colorScale, fipsToColorValue]
  );

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
