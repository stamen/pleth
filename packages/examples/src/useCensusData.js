import { useCache } from './pleth/useCache';
import { csv } from 'd3-fetch';
import { timeParse } from 'd3-time-format';
export const parseDate = timeParse('%m/%d/%Y');

export const useCensusData = (activeId) => {
  const { get } = useCache();
  const censusData = get({
    cacheKey: 'censusData' + activeId,
    onCacheMiss: () =>
      csv('usCensusData/data/states.csv', (d) => ({
        date: parseDate(d.date),
        population: +d.population,
        density: +d.density,
        fips: d.fips,
      })),
  });
  return censusData;
};
