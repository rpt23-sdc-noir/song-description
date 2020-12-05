require('newrelic');
const express = require("express");
const cors = require("cors");
const path = require('path');
const chalk = require('chalk');
const pool = require('../database/db_pg.js');
const port = 2001;

const redis = require('redis')
const redis_client = redis.createClient();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const expressStaticGzip = require('express-static-gzip');
const { ProvidePlugin } = require("webpack");

// compression serving files
app.get('/bundle.js', cors(), (req, res) => {
  res.sendFile(path.join(__dirname, '../client/bundle.js'));
});
app.use('/:songId', express.static(path.join(__dirname, '../client')));

app.use('/', expressStaticGzip(path.join(__dirname, '../client'), {
  enableBrotli: true,
  orderPreference: ['br', 'gz'],
  setHeaders: function (res, path) {
    res.setHeader("Cache-Control", "client, max-age=31536000");
  }
}));

//Middleware Function to Check Cache
checkCache = (req, res, next) => {
  const { songId } = req.params;

  //get data value for key =id
  redis_client.get(songId, (err, data) => {
      if (err) {
          console.log(err);
          res.status(500).send(err);
      }
      //if no match found
      if (data != null) {
          res.send(data);
      }
      else {
          //proceed to next middleware function
          next();
      }
   });
};

// CRUD Operations start
app.get('/songDescription/:songId', async(req, res) => {
  try {
    const { songId } = req.params;
    const description = await pool.query("SELECT * FROM song WHERE song_id = $1;", [songId]);
    const descriptioData = description.rows[0];

    redis_client.setex(songId, 3600, JSON.stringify(descriptioData));

    if (!descriptioData) {
      return res.status(400).json({
        success: false,
        msg: `No description for songId: ${req.params.songId}`
      });
    }
    res.status(200).send({
      success: true,
      data: descriptioData
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      msg: error
    });
  }
});

app.post('/songDescription', async(req, res) => {
  try {
    const { description, bandName } = req.body;
    const newDescription = await pool.query(
      "INSERT INTO song (band_description, band_name) VALUES($1, $2) returning *",
      [description, bandName]
    );
    res.status(200).send({
      success: true,
      data: newDescription.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      msg: error
    });
  }
});

app.put('/songDescription/:songId', async(req, res) => {
  try {
    const { songId } = req.params;
    const { description, bandName } = req.body;
    const updateDescription = await pool.query(
      "UPDATE song SET (band_description, band_name) = ($1, $2) WHERE song_id = $3",
      [description, bandName, songId]
    );
    console.log(updateDescription);
    if ( updateDescription.rowCount === 0 ) {
      return res.status(400).json({
        success: false,
        msg: `No description for songId: ${req.params.songId}`
      });
    }

    res.status(200).send({
      success: true,
      data: {
        song_id: songId,
        band_description: description,
        band_name: bandName
      }
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      msg: error
    });
  }
});

app.delete('/songDescription/:songId', async(req, res) => {
  try {
    const { songId } = req.params;
    const descriptionDelete = await pool.query("DELETE FROM song WHERE song_id = $1;", [songId]);

    console.log(descriptionDelete);
    if ( descriptionDelete.rowCount === 0 || descriptionDelete.deletedCount === 0 ) {
      return res.status(400).json({
        success: false,
        msg: `No description for songId: ${songId}`
      });
    }

    res.status(200).send({
      success: true,
      data: `rows deleted: ${descriptionDelete.rowCount}`
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      msg: error
    });
  }
});

// CRUD operations end


app.get('/:current', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(port, () => {
  console.log(chalk.magenta(`Server running on port at http://localhost:${port}`));
});

module.exports = app;
