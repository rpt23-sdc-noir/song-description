const express = require("express");
const cors = require("cors");
const path = require('path');
const chalk = require('chalk');
const pool = require('../database/db_pg.js');
const port = 2001;

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
// CRUD Operations start
app.get('/songDescription/:songId', async(req, res) => {
  try {
    const { songId } = req.params;
    const description = await pool.query("SELECT * FROM song WHERE song_id = $1;", [songId]);

    if (!description.rows[0]) {
      return res.status(400).json({
        success: false,
        msg: `No description for songId: ${req.params.songId}`
      });
    }
    res.status(200).send({
      success: true,
      data: description.rows[0]
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

    if (!updateDescription.rows[0]) {
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

    if ( descriptionDelete.rowCount === 0 ) {
      return res.status(400).json({
        success: false,
        msg: `No description for songId: ${songId}`
      });
    }

    res.status(200).send({
      success: true,
      data: descriptionDelete.rowCount
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