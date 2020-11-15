const express = require('express');
const path = require('path');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const db = require('../database/db.js');
const cors = require('cors');
const port = 2001;
const expressStaticGzip = require('express-static-gzip');

const app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

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


// server API requests start
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

app.post('/songDescription', async(req, res) => {
  // console.log(req.body);
  try {
    const description = await db.saveDescriptions(req.body);
    res.status(200).json({
      success: true,
      msg: 'create one song description',
      data: description
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: `something went wrong`,
      error: error
    });
  }
});

app.put('/songDescription/:songId', async(req, res) => {
  try {
    const description = await db.findDescriptionandUpdate(req.params.songId, req.body, {
      new: true,
    });

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

app.delete('/songDescription/:songId', async(req, res) => {
  try {
    const description = await db.deleteDescription(req.params.songId);
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

// server API requests end

app.get('/:current', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(port, () => {
  console.log(chalk.magenta(`Server running on port at http://localhost:${port}`));
});

module.exports = app;