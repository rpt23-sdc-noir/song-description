const fs = require('fs');
const csvWriter = require('csv-write-stream');
const writer = csvWriter();
const recordsInt = 10000000;
// const recordsInt = 10;

const bands = require('./bandNames.js');
const studios = require('./studioNames.js');

const randoNum = () => {
  const startNum = 1;
  const endNum = 100;
  return Math.floor(Math.random() * endNum) + startNum;
}

const createSeedCsv = () => {
  writer.pipe(fs.createWriteStream('seed.csv'));
  for (var i = 0; i < recordsInt; i++) {
    writer.write({
      bandName: bands.bandNames[randoNum()],
      description: `Recorded, mixed, and mastered at ${studios.studioNames[randoNum()]} Studios. Produced by ${bands.bandNames[randoNum()]}. © 2020 ${bands.bandNames[randoNum()]}. All rights reserved.`
    });
  }
  writer.end();
}

createSeedCsv();

// pg sql command
// COPY song(band_name, band_description)
// FROM '/Users/toly/Desktop/hack_reactor/sdc/song-description/seed.csv'
// DELIMITER ','
// CSV HEADER;