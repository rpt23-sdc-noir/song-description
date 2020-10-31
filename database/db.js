// ----------- DB CONNECTION ---------- //

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/descriptions', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB!');
});

// ------------- DB SCHEMA ------------ //

const infoSchema = new mongoose.Schema({
  songId: {
    type: Number,
    unique: true
  },
  bandId: {
    type: Number,
    unique: true
  },
  bandName: String,
  description: String
});

const Description = mongoose.model('Description', infoSchema);

// -------- SAVE DESCRIPTION FUNC -------- //

const saveDescriptions = (descriptionData) => {
  var description = new Description(descriptionData);
  return description.save()
    .catch((error) => {
      console.log('Error saving to database: ', error);
    });
};

// --------- FIND SONG DESCRIPTION -------- //

const findDescription = function(id) {
  return Description.findOne({songId: id})
    .catch((error) => {
      console.log('Error finding song description in db: ', error);
    });
};

// ---------- DELETE DESCRIPTIONS --------- //

const deleteDescriptions = function() {
  return Description.deleteMany({})
    .catch((error) => {
      console.log('Error delete song descriptions in database: ', error);
    });
};

// --------------- EXPORTS ----------------- //

module.exports.saveDescriptions = saveDescriptions;
module.exports.findDescription = findDescription;
module.exports.deleteDescriptions = deleteDescriptions;