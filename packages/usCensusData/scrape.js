import { writeFileSync } from 'fs';
import fetch from 'node-fetch';
import { csvFormat } from 'd3-dsv';

// See https://www.census.gov/data/developers/data-sets/popest-popproj/popest.html

const getData = async ({ url, parseRow }) => {
  const response = await fetch(url);
  const dataRaw = await response.json();
  const header = dataRaw.slice(0, 1)[0];
  const rows = dataRaw.slice(1);
  return rows.map((row) =>
    parseRow(
      header.reduce(
        (accumulator, column, i) => ({ ...accumulator, [column]: row[i] }),
        {}
      )
    )
  );
};

const populationRow = (getFips) => (d) => {
  const row = {
    date: d.DATE_DESC.split(' ')[0],
    population: +d.POP,
    density: +d.DENSITY,
  };
  if (getFips) {
    row.fips = getFips(d);
  }
  return row;
};

//const fipsToNameRow = (d) => ({
//  date: d.DATE_DESC.split(' ')[0],
//  fips: getFips(d),
//  population: +d.POP,
//  density: +d.DENSITY,
//});

const writeData = ({ fileName, data }) => {
  writeFileSync(fileName, csvFormat(data));
};

const urlBase = 'https://api.census.gov/data/2019/pep/population';

const scrapeUS = async () => {
  const data = await getData({
    url: `${urlBase}?get=DATE_CODE,DATE_DESC,DENSITY,POP,NAME&for=us:*`,
    parseRow: populationRow(),
  });
  writeData({ fileName: 'data/us.csv', data });
};

const scrapeStates = async () => {
  const data = await getData({
    url: `${urlBase}?get=COUNTY,DATE_CODE,DATE_DESC,DENSITY,POP,NAME,STATE&for=state:*`,
    parseRow: populationRow((d) => d.state),
  });
  writeData({ fileName: 'data/states.csv', data });
  return Array.from(new Set(data.map((d) => d.fips))).sort();
};

const scrapeCounties = async (stateFips) => {
  const data = await getData({
    url: `${urlBase}?get=COUNTY,DATE_CODE,DATE_DESC,DENSITY,POP&in=state:${stateFips}&for=county:*`,
    parseRow: populationRow((d) => stateFips + d.county),
  });
  writeData({ fileName: `data/counties_${stateFips}.csv`, data });
};

//const scrapeNames = async () => {
//  const data = await getData({
//    url: `${urlBase}?get=COUNTY,DATE_CODE,DATE_DESC,DENSITY,POP,NAME,STATE&for=state:*`,
//    getFips: (d) => d.state,
//  });
//  writeData({ fileName: 'data/fipsToName.csv', data });
//};

const scrape = async () => {
  await scrapeUS();
  const states = await scrapeStates();
  states.forEach(scrapeCounties);

  //scrapeNames();
};

scrape();
