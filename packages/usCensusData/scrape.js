import { writeFileSync } from 'fs';
import fetch from 'node-fetch';
import { csvFormat } from 'd3-dsv';

// See https://www.census.gov/data/developers/data-sets/popest-popproj/popest.html
const isPopulationEstimate = (d) => d.DATE_DESC.endsWith('population estimate');

const getData = async ({ url, parseRow }) => {
  const response = await fetch(url);
  const dataRaw = await response.json();
  const header = dataRaw.slice(0, 1)[0];
  const rows = dataRaw.slice(1);
  return rows
    .map((row) =>
      header.reduce(
        (accumulator, column, i) => ({ ...accumulator, [column]: row[i] }),
        {}
      )
    )
    .filter(isPopulationEstimate)
    .map(parseRow);
};

const fipsToName = {};

const populationRow = (getFips) => (d) => {
  const row = {
    date: d.DATE_DESC.split(' ')[0],
    population: +d.POP,
    density: +d.DENSITY,
    fips: getFips(d),
  };
  fipsToName[row.fips] = d.NAME;
  return row;
};

const writeData = ({ fileName, data }) => {
  writeFileSync(fileName, csvFormat(data));
};

const urlBase = 'https://api.census.gov/data/2019/pep/population';

const scrapeUS = async () => {
  const data = await getData({
    url: `${urlBase}?get=DATE_CODE,DATE_DESC,DENSITY,POP,NAME&for=us:*`,
    parseRow: populationRow((d) => ''),
  });
  writeData({ fileName: 'data/us.csv', data });
};

const scrapeStates = async () => {
  const data = await getData({
    url: `${urlBase}?get=DATE_CODE,DATE_DESC,DENSITY,POP,STATE,NAME&for=state:*`,
    parseRow: populationRow((d) => d.state),
  });
  writeData({ fileName: 'data/states.csv', data });
  return Array.from(new Set(data.map((d) => d.fips))).sort();
};

const scrapeCounties = async (stateFips) => {
  const data = await getData({
    url: `${urlBase}?get=COUNTY,DATE_CODE,DATE_DESC,DENSITY,POP,NAME&in=state:${stateFips}&for=county:*`,
    parseRow: populationRow((d) => stateFips + d.county),
  });
  writeData({ fileName: `data/counties_${stateFips}.csv`, data });
};

const writeNames = () => {
  const data = [];
  Object.keys(fipsToName)
    .sort()
    .forEach((fips) => {
      data.push({
        fips,
        name: fipsToName[fips],
      });
    });
  writeData({ fileName: `data/fipsToName.csv`, data });
};

const scrape = async () => {
  await scrapeUS();
  const states = await scrapeStates();
  await Promise.all(states.map(scrapeCounties));
  writeNames();
};

scrape();
