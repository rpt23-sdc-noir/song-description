// const mongoose = require('mongoose');
const database = require('../database/db_pg.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server/server_pg.js');

const should = chai.should();
chai.use(chaiHttp);

describe('/POST description', () => {
  it('should POST a song description', (done) => {
    let description = {
      "bandName": "sick name toly",
      "description": "sick description bruhhh"
    }
    chai.request(app)
      .post('/songDescription')
      .send(description)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.an('object');
        res.body.data.song_id.should.be.a('number');
        res.body.data.band_description.should.be.a('string');
        res.body.data.band_name.should.be.a('string');
        res.body.data.band_name.should.be.equal('sick name toly');
        done();
      });
  });
});

describe('/PUT descriptions', () => {
  it('Should update a song description by songId', (done) => {
    let description = {
      "bandName": "DOPE name toly",
      "description": "its aliveeeeee"
    }
    chai.request(app)
      .put('/songDescription/100')
      .send(description)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.an('object');
        res.body.data.band_description.should.be.a('string');
        res.body.data.band_name.should.be.a('string');
        res.body.data.band_name.should.be.equal('DOPE name toly');
        res.body.data.band_description.should.be.equal('its aliveeeeee');
        done();
      });
  });

  it('Should return an error if the song does not exist', (done) => {
    chai.request(app)
<<<<<<< HEAD
      .put('/songDescription/99999999')
=======
      .get('/songDescription/99999999')
>>>>>>> main
      .end((err, res) => {
        console.log('Response: ', res.body);
        res.should.have.status(400);
        res.body.success.should.be.equal(false);
        done();
    });
  });
});

describe('/DELETE descriptions', () => {
  // have to update id for each test
  const id = 10000033;

  it('Should delete a song description by songId', (done) => {
    chai.request(app)

      .delete(`/songDescription/${id}`)
      .end((err, res) => {
        console.log('Response: ', res.body);
        res.should.have.status(200);
        res.body.success.should.be.equal(true);
        res.body.data.should.be.equal('rows deleted: 1');
        done();
      });
  });

  it('Should not return a song description after it was deleted', (done) => {
    chai.request(app)
      .get(`/songDescription/${id}`)
      .end((err, res) => {
        console.log('Response: ', res.body);
        res.should.have.status(400);
        res.body.success.should.be.equal(false);
        done();
    });
  });

  it('Should return an error if the song does not exist', (done) => {
    chai.request(app)
<<<<<<< HEAD
      .delete('/songDescription/99999999')
=======
      .get('/songDescription/99999999')
>>>>>>> main
      .end((err, res) => {
        console.log('Response: ', res.body);
        res.should.have.status(400);
        res.body.success.should.be.equal(false);
        done();
<<<<<<< HEAD
      });
=======
    });
>>>>>>> main
  });
});

describe('/GET descriptions', () => {
  it('Should return a song description with a songId of 100', (done) => {
    chai.request(app)
      .get('/songDescription/100')
      .end((err, res) => {
        console.log('Response: ', res.body);
        res.should.have.status(200);
        res.body.data.should.be.an('object');
<<<<<<< HEAD
        res.body.data.song_id.should.be.a('number');
        res.body.data.song_id.should.be.equal(100);
        res.body.data.band_id.should.be.equal(100);
        res.body.data.band_description.should.be.a('string');
        res.body.data.band_name.should.be.a('string');
=======
        res.body.data.songId.should.be.a('number');
        res.body.data.songId.should.be.equal(99);
        res.body.data.bandId.should.be.equal(99);
        res.body.data.description.should.be.a('string');
        res.body.data.bandName.should.be.a('string');
>>>>>>> main
        done();
      });
  });

  it('it should return an error if input songId is 99999999', () => {
    chai.request(app)
      .get('/songDescription/99999999')
      .end((err, res) => {
        console.log(res.body);
        res.should.have.status(400);
        res.body.msg.should.be.a('string');
        res.body.msg.should.be.equal('No description for songId: 99999999');
      });
  });
});