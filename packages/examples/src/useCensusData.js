import { useCache } from '@stamen/pleth-cache';
import { plethIdFIPS } from './pleth/plethIdFIPS';
import { csv } from 'd3-fetch';
import { timeParse } from 'd3-time-format';
export const parseDate = timeParse('%m/%d/%Y');

const fips = (plethId) => plethId.substr(5);

const fetchData = (activeId) => {
  if (activeId === 'USA') {
    return () =>
      csv('usCensusData/data/states.csv', (d) => ({
        date: parseDate(d.date),
        population: +d.population,
        density: +d.density,
        id: plethIdFIPS(d.fips),
      }));
  } else {
    return () =>
      csv(`usCensusData/data/counties_${fips(activeId)}.csv`, (d) => ({
        date: parseDate(d.date),
        population: +d.population,
        density: +d.density,
        id: plethIdFIPS(d.fips),
      }));
  }
};

export const useCensusData = (activeId) => {
  const { get } = useCache();
  const censusData = get({
    cacheKey: 'censusData' + activeId,
    onCacheMiss: fetchData(activeId),
  });
  return censusData;
};
