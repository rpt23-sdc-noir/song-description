const express = require('express');
const app = express();
const path = require('path');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const db = require('../database/db.js');
const cors = require('cors');
const port = 2001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
// app.get('/bundle.js', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/bundle.js'));
// });
app.use('/:songId', express.static(path.join(__dirname, '../client')));

app.get('/songDescription/:songId', async(req, res) => {
  try {
    const description = await db.findDescription(req.params.songId);
    if (!description) {
      return res.status(400).json({
        success: false,
        msg: `No description for songId: ${req.params.songId}`
      });
    }
    res.status(200).send({
      success: true,
      data: description
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      msg: error
    });
  }
});

app.get('/:current', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(port, () => {
  console.log(chalk.magenta(`Server running on port at http://localhost:${port}`));
});

module.exports = app;