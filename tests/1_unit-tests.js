const chai = require('chai');
const assert = chai.assert;

const SudokuSolver = require('../controllers/sudoku-solver.js');
const puzzlesAndSolutions = require('../controllers/puzzle-strings.js').puzzlesAndSolutions;
let solver = new SudokuSolver();
suite('UnitTests', () => {
  test('Logic handles a valid puzzle string of 81 characters', (done) => {
      puzzlesAndSolutions.forEach(e=>assert.isOk(solver.validate(e[0])));
      done();
    });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', (done) => {
      try {
        let input='AA9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        solver.validate(input);
        assert.fail();
      } catch(err) {
        assert.equal(err.message,'Invalid characters in puzzle');
      }
      done();
    });

  test('Logic handles a puzzle string that is not 81 characters in length', (done) => {
      try {
        let input='9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        solver.validate(input);
        assert.fail();
      } catch(err) {
        assert.equal(err.message,'Expected puzzle to be 81 characters long');
      }
      done();
    });

  test('Logic handles a valid row placement', (done) => {
      let puzzle='..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      let row=0;
      let column=0;
      let value=7;
      assert.isOk(solver.checkRowPlacement(puzzle,row,column,value).result);
      done();
    });

  test('Logic handles an invalid row placement', (done) => {
      let puzzle='..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      let row=0;
      let column=0;
      let value=1;
      assert.isNotOk(solver.checkRowPlacement(puzzle,row,column,value).result);
      done();
    });

  test('Logic handles a valid column placement', (done) => {
      let puzzle='..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      let row=0;
      let column=0;
      let value=7;
      assert.isOk(solver.checkColPlacement(puzzle,row,column,value).result);
      done();
    });

  test('Logic handles an invalid column placement', (done) => {
      let puzzle='..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      let row=0;
      let column=0;
      let value=1;
      assert.isNotOk(solver.checkColPlacement(puzzle,row,column,value).result);
      done();
    });

  test('Logic handles a valid region (3x3 grid) placement', (done) => {
      let puzzle='..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      let row=0;
      let column=0;
      let value=7;
      assert.isOk(solver.checkRegionPlacement(puzzle,row,column,value).result);
      done();
    });

  test('Logic handles an invalid region (3x3 grid) placement', (done) => {
      let puzzle='..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      let row=0;
      let column=0;
      let value=2;
      assert.isNotOk(solver.checkRegionPlacement(puzzle,row,column,value).result);
      done();
    });

  test('Valid puzzle strings pass the solver', (done) => {
      puzzlesAndSolutions.forEach(e=>assert.deepEqual(solver.solve(e[0]),e[1]));
      done();
    });

  test('Invalid puzzle strings fail the solver', (done) => {
      let puzzle='6.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      try {
        solver.solve(puzzle);
        assert.fail();
      } catch(err) {
        assert.equal(err.message,'Puzzle cannot be solved');
      }
      done();
    });

    test('Solver returns the the expected solution for an incomplete puzzzle', (done) => {
      puzzlesAndSolutions.forEach(e=>assert.deepEqual(solver.solve(e[0]),e[1]));
      done();
    });
});
