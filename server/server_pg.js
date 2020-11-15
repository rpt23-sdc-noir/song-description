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

    if (!description) {
      return res.status(400).json({
        success: false,
        msg: `No description for songId: ${req.params.songId}`
      });
    }
    // res.json(description);

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

// CRUD operations end


app.get('/:current', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(port, () => {
  console.log(chalk.magenta(`Server running on port at http://localhost:${port}`));
});

module.exports = app;
