const mongoose = require('mongoose');
const database = require('../database/db.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server/server.js');

const should = chai.should();
chai.use(chaiHttp);

describe('/POST description', () => {
  it('should POST a song description', (done) => {
    let description = {
      "songId": 14,
      "bandId": 14,
      "bandName": "sick name toly",
      "description": "sick description bruhhh"
    }
    chai.request(app)
      .post('/songDescription')
      .send(description)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.an('object');
        res.body.data.songId.should.be.a('number');
        res.body.data.songId.should.be.equal(14);
        res.body.data.bandId.should.be.equal(14);
        res.body.data.description.should.be.a('string');
        res.body.data.bandName.should.be.a('string');
        res.body.data.bandName.should.be.equal('sick name toly');
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
      .put('/songDescription/14')
      .send(description)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.an('object');
        res.body.data.songId.should.be.a('number');
        res.body.data.songId.should.be.equal(14);
        res.body.data.bandId.should.be.equal(14);
        res.body.data.description.should.be.a('string');
        res.body.data.bandName.should.be.a('string');
        res.body.data.bandName.should.be.equal('DOPE name toly');
        res.body.data.description.should.be.equal('its aliveeeeee');
        done();
      });
  });
});

describe('/DELETE descriptions', () => {
  it('Should not delete a song description by songId', (done) => {
    chai.request(app)
      .delete('/songDescription/14')
      .end((err, res) => {
        console.log('Response: ', res.body);
        res.should.have.status(200);
        res.body.success.should.be.equal(true);
        res.body.data.should.be.an('object');
        done();
      });
  });

  it('Should not return a song description after it was deleted', (done) => {
    chai.request(app)
      .get('/songDescription/14')
      .end((err, res) => {
        console.log('Response: ', res.body);
        res.should.have.status(400);
        res.body.success.should.be.equal(false);
        done();
    });
  });
});

describe('/GET descriptions', () => {
  it('Should return a song description with a songId of 99', (done) => {
    chai.request(app)
      .get('/songDescription/99')
      .end((err, res) => {
        console.log('Response: ', res.body);
        res.should.have.status(200);
        res.body.data.should.be.an('object');
        res.body.data.songId.should.be.a('number');
        res.body.data.songId.should.be.equal(99);
        res.body.data.bandId.should.be.equal(99);
        res.body.data.description.should.be.a('string');
        res.body.data.bandName.should.be.a('string');
        res.body.data.bandName.should.be.equal('The Fearsome Onrush');
        done();
      });
  });

  it('it should return an error if input songId is 101', () => {
    chai.request(app)
      .get('/songDescription/101')
      .end((err, res) => {
        console.log(res.body);
        res.should.have.status(400);
        res.body.msg.should.be.a('string');
        res.body.msg.should.be.equal('No description for songId: 101');
      });
  });
});