var app = require('./app.js');
var chai = require('chai');
var request = require('supertest');

var expect = chai.expect;

describe('Healthz Test', function () {
  it('GET /healthz should return a 200 OK response', function (done) {
    request(app)
      .get('/healthzz')
      .end(function (err, res) {
        expect(res.statusCode).to.be.equal(200);
        done();
      });
  });
});