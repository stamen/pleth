import { writeFileSync } from 'fs';
import fetch from 'node-fetch';
import { csvFormat } from 'd3-dsv';

const getData = async ({ url, getFips }) => {
  const response = await fetch(url);
  const dataRaw = await response.json();
  const header = dataRaw.slice(0, 1)[0];
  const rows = dataRaw.slice(1);
  return rows.map((row) => {
    const d = header.reduce(
      (accumulator, column, i) => ({ ...accumulator, [column]: row[i] }),
      {}
    );
    return {
      date: d.DATE_DESC.split(' ')[0],
      fips: getFips(d),
      population: +d.POP,
      density: +d.DENSITY,
    };
  });
};

const writeData = ({ fileName, data }) => {
  writeFileSync(fileName, csvFormat(data));
};

const urlBase = 'https://api.census.gov/data/2019/pep/population';

// See https://www.census.gov/data/developers/data-sets/popest-popproj/popest.html
const scrapeUS = async () => {
  const data = await getData({
    url: `${urlBase}?get=DATE_CODE,DATE_DESC,DENSITY,POP,NAME&for=us:*`,
    getFips: (d) => d.us,
  });
  writeData({ fileName: 'data/us.csv', data });
};

const scrapeStates = async () => {
  const data = await getData({
    url: `${urlBase}?get=COUNTY,DATE_CODE,DATE_DESC,DENSITY,POP,NAME,STATE&for=state:*`,
    getFips: (d) => d.state,
  });
  writeData({ fileName: 'data/states.csv', data });
  return Array.from(new Set(data.map((d) => d.fips))).sort();
};

const scrape = async () => {
  await scrapeUS();
  const states = await scrapeStates();
  console.log(states);
};

scrape();
