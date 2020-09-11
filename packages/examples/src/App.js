import React, { useMemo } from 'react';
import { feature } from 'topojson';
import { scaleSequentialLog } from 'd3-scale';
import { max } from 'd3-array';
import { gray } from 'd3-color';
import { interpolateGreys } from 'd3-scale-chromatic';
import Pleth, { PolygonsLayer, PolygonLabelsLayer, useURLState } from './pleth';
import { plethIdFIPS } from './pleth/plethIdFIPS';
import { useCensusData, parseDate } from './useCensusData';
import './App.css';

import { json } from 'd3-fetch';

// TODO move this to a unified place.
const isFIPS = (id) => id.startsWith('FIPS_');
const isUSStateFIPS = (id) => isFIPS(id) && id.length === 7;

const isFIPSParent = (parentId) => (childId) =>
  isFIPS(parentId) &&
  isFIPS(childId) &&
  parentId.substr(5, 2) === childId.substr(5, 2);

// This fetches the children geometries for the given ID.
const geometryURLFromId = (id) => {
  if (id === 'USA') {
    return 'https://unpkg.com/us-atlas@3.0.0/states-10m.json';
  } else if (isUSStateFIPS(id)) {
    return 'https://unpkg.com/us-atlas@3.0.0/counties-10m.json';
  }
  throw new Error('Unknown ID provided: ' + id);
};

const topoFeature = async (promise, property, filter) => {
  const data = await promise;
  const objects = data.objects[property];

  // Generate a "Pleth ID" with FIPS prefix.
  objects.geometries.forEach((geometry) => {
    geometry.id = plethIdFIPS(geometry.id);
  });

  if (filter) {
    objects.geometries = objects.geometries.filter((geometry) =>
      filter(geometry.id)
    );
  }

  return feature(data, objects);
};

const USStatesGeometryProvider = {
  isSupportedId: (id) => id === 'USA',
  fetchGeometriesForID: (id) =>
    topoFeature(json(geometryURLFromId(id)), 'states'),
};

const USCountiesGeometryProvider = {
  isSupportedId: isUSStateFIPS,
  fetchGeometriesForID: (id) =>
    topoFeature(json(geometryURLFromId(id)), 'counties', isFIPSParent(id)),
};

const geometryProviders = [
  USStatesGeometryProvider,
  USCountiesGeometryProvider,
];

const activeDate = parseDate('7/1/2019');
const colorValue = (d) => d.density;

const urlStateConfig = {
  activeId: {
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
  const [urlState, urlDispatch] = useURLState(urlStateConfig, urlStateReducer);
  const { activeId } = urlState;

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

  const idToColorValue = useMemo(
    () =>
      activeDateData
        ? activeDateData.reduce((accumulator, d) => {
            accumulator[d.id] = colorValue(d);
            return accumulator;
          }, {})
        : null,
    [activeDateData]
  );

  const layers = useMemo(
    () => [
      PolygonsLayer({
        fillStyle: (feature) =>
          idToColorValue ? colorScale(idToColorValue[feature.id]) : 'white',
        strokeStyle: gray(80),
      }),
      PolygonLabelsLayer,
    ],
    [colorScale, idToColorValue]
  );

  return (
    <div className="App">
      <Pleth
        layers={layers}
        geometryProviders={geometryProviders}
        activeId={activeId}
        urlDispatch={urlDispatch}
      />
    </div>
  );
};

export default App;
