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

// See https://www.census.gov/data/developers/data-sets/popest-popproj/popest.html
const scrapeUS = async () => {
  const data = await getData({
    url:
      'https://api.census.gov/data/2019/pep/population?get=COUNTY,DATE_CODE,DATE_DESC,DENSITY,POP,NAME,STATE&for=us:*',
    getFips: (d) => d.us,
  });
  const csv = csvFormat(data);
  writeFileSync('data/us.csv', csv);
};

const scrapeStates = async () => {
  const data = await getData({
    url:
      'https://api.census.gov/data/2019/pep/population?get=COUNTY,DATE_CODE,DATE_DESC,DENSITY,POP,NAME,STATE&for=state:*',
    getFips: (d) => d.state,
  });

  const csv = csvFormat(data);
  writeFileSync('data/states.csv', csv);
  return Array.from(new Set(data.map((d) => d.fips))).sort();
};

const scrape = async () => {
  await scrapeUS();
  const states = await scrapeStates();
  console.log(states);
};

scrape();
