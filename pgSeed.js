const fs = require('fs');
const csvWriter = require('csv-write-stream');
const writer = csvWriter();
const recordsInt = 10000000;
// const recordsInt = 10;

const bands = require('./bandNames.js');
const studios = require('./studioNames.js');

const randoNum = () => {
  const startNum = 0;
  const endNum = 99;
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

// const createSeedCsv = () => {
//   writer.pipe(fs.createWriteStream('seed.csv'));
//   (async () => {
//     for (var i = 0; i < recordsInt; i++) {
//       if (!writer.write({
//           bandName: bands.bandNames[randoNum()],
//           description: `Recorded, mixed, and mastered at ${studios.studioNames[randoNum()]} Studios. Produced by ${bands.bandNames[randoNum()]}. © 2020 ${bands.bandNames[randoNum()]}. All rights reserved.`
//       })) {
//         await new Promise(resolve => file.once('drain', resolve));
//       }
//     }
//     writer.end();
//   });
// }

createSeedCsv();

// pg sql command
// COPY song(band_name, band_description)
// FROM '/Users/toly/Desktop/hack_reactor/sdc/song-description/smallSeed.csv'
// DELIMITER ','
// CSV HEADER;

// pg sql command
// \COPY song(band_name, band_description) FROM '/home/ec2-user/song-description/seed1.csv' DELIMITER ',' CSV HEADER;
// access postgres from ip
// cat command sent file one line at a time across http
// into pg

// vim FILE_NAME
// type the letter 'i'
// press 'esc'
// when done, ':wq!'

// listen for drain event in node