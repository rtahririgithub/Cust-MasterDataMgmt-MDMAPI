'use strict'

var server = require('../src/server');
var chai = require('chai');
var supertest = require('supertest');
var expect = chai.expect;
var request = require('request');
var config = require('config');

describe('Deployment integration test', function() {
  it('should return 200 response', function(done){
    request(config.get('integrationTest.routePath'), function(err, resp, body) {
      expect(resp.statusCode).to.equal(200);
      done();
    });
  });
});

describe('Greeting integration test', function() {
  describe('#GET /greeting tasks', function() {
    it('should protect greeting resource, expected 401 response ', function(done) {
      supertest(server)
        .get('/v1/greeting?name=PaaS')
        .end(function(err, res) {
          expect(res.status).to.equal(401);
          done();
        });
    });
  });

  describe('#GET / ', function() {
    it('should return default hello world greeting', function(done) {
      supertest(server)
        .get('/v1/')
        .end(function(err,res) {
          expect(res.status).to.equal(200);
          expect(res.body.content).to.equal('Hello, World!')
          done();
        })
    })
  })
});
