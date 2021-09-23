const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const puzzlesAndSolutions = require('../controllers/puzzle-strings.js').puzzlesAndSolutions;
chai.use(chaiHttp);

suite('Functional Tests', () => {

  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function(done) {
    puzzlesAndSolutions.forEach(e=>{
      chai.request(server)
      .post('/api/solve')
      .send({puzzle: e[0]})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.deepEqual(res.body.solution, e[1]);
      });
    });
    done();
  });

  test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function(done) {
      chai.request(server)
      .post('/api/solve')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Required field missing');
      });
    done();
  });

  test('Solve a puzzle with invalid characters: POST request to /api/solve', function(done) {
      chai.request(server)
      .post('/api/solve')
      .send({puzzle: 'AA9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid characters in puzzle');
      });
    done();
  });

  test('Solve a puzzle with incorrect length: POST request to /api/solve', function(done) {
      chai.request(server)
      .post('/api/solve')
      .send({puzzle: '9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
      });
    done();
  });

  test('Solve a puzzle that cannot be solved: POST request to /api/solve', function(done) {
      chai.request(server)
      .post('/api/solve')
      .send({puzzle: '6.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Puzzle cannot be solved');
      });
    done();
  });

  test('Check a puzzle placement with all fields: POST request to /api/check', function(done) {
      chai.request(server)
      .post('/api/check')
      .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',coordinate:'A1',value:7})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isOk(res.body.valid);
      });
    done();
  });

  test('Check a puzzle placement with single placement conflict: POST request to /api/check', function(done) {
      chai.request(server)
      .post('/api/check')
      .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',coordinate:'A1',value:6})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isNotOk(res.body.valid);
        assert.isArray(res.body.conflict);
        assert.equal(res.body.conflict.length,1);
      });
    done();
  });

  test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function(done) {
      chai.request(server)
      .post('/api/check')
      .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',coordinate:'A1',value:1})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isNotOk(res.body.valid);
        assert.isArray(res.body.conflict);
        assert.isAbove(res.body.conflict.length,1);
      });
    done();
  });

  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function(done) {
      chai.request(server)
      .post('/api/check')
      .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',coordinate:'A1',value:5})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isNotOk(res.body.valid);
        assert.isArray(res.body.conflict);
        assert.equal(res.body.conflict.length,3);
      });
    done();
  });

  test('Check a puzzle placement with missing required fields: POST request to /api/check', function(done) {
      chai.request(server)
      .post('/api/check')
      .send({notPuzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',coordinate:'A1',value:5})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error,'Required field(s) missing');
      });
    done();
  });

  test('Check a puzzle placement with invalid characters: POST request to /api/check', function(done) {
      chai.request(server)
      .post('/api/check')
      .send({puzzle: 'AA9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',coordinate:'A1',value:5})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error,'Invalid characters in puzzle');
      });
    done();
  });

  test('Check a puzzle placement with incorrect length: POST request to /api/check', function(done) {
      chai.request(server)
      .post('/api/check')
      .send({puzzle: '9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',coordinate:'A1',value:5})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error,'Expected puzzle to be 81 characters long');
      });
    done();
  });

  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function(done) {
      chai.request(server)
      .post('/api/check')
      .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',coordinate:'Z1',value:5})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error,'Invalid coordinate');
      });
    done();
  });

  test('Check a puzzle placement with invalid placement value: POST request to /api/check', function(done) {
      chai.request(server)
      .post('/api/check')
      .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',coordinate:'A1',value:100})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error,'Invalid value');
      });
    done();
  });

});

