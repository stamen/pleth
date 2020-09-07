import {writeFileSync} from 'fs';
import fetch from 'node-fetch';
import { csvFormat } from 'd3-dsv';

// See https://www.census.gov/data/developers/data-sets/popest-popproj/popest.html
const scrape = async () => {
  try {
    const response = await fetch(
      'https://api.census.gov/data/2019/pep/population?get=COUNTY,DATE_CODE,DATE_DESC,DENSITY,POP,NAME,STATE&for=us:*'
    );
    const dataRaw = await response.json();
    const header = dataRaw.slice(0, 1)[0];
    const rows = dataRaw.slice(1);
    const data = rows.map((row) => {
      const d = header.reduce(
        (accumulator, column, i) => ({ ...accumulator, [column]: row[i] }),
        {}
      );
      // d = for example:
      //  {
      //    COUNTY: null,
      //    DATE_CODE: '1',
      //    DATE_DESC: '4/1/2010 Census population',
      //    DENSITY: '87.38797508100000',
      //    POP: '308745538',
      //    NAME: 'United States',
      //    STATE: null,
      //    us: '1'
      //  },
      return {
        date: d.DATE_DESC.split(' ')[0],
        fips: d.us,
        population: +d.POP,
        density: +d.DENSITY,
      };
    });

    const csv = csvFormat(data);
    writeFileSync('1.csv', csv);
  } catch (error) {
    console.log(error);
  }
};

scrape();
