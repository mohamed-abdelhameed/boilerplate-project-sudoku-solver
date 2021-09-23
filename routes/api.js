'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      if (!req.body.puzzle||!req.body.value||!req.body.coordinate) {
        res.json({ error: 'Required field(s) missing' });
        return;
      }

      let puzzle = req.body.puzzle;
      
      try {
        solver.validate(puzzle);
        let coordinate = req.body.coordinate;
        let coord = [...coordinate];
        let row = coord[0].charCodeAt()-"A".charCodeAt();
        let column = coord[1]-1;
        if (row>8||row<0||column>8||column<0) {
          res.json({ error: 'Invalid coordinate'});
          return;
        }
        
        let value = Number(req.body.value);
        if (!(value<10&&value>0)) {//to validate against Nan as well
          res.json({ error: 'Invalid value'});
          return;
        }
        let conflict=[];
        let validRow = solver.checkRowPlacement(puzzle,row,column,value).result;
        if(!validRow) conflict.push('row');
        // console.log(validRow);
        let validColumn = solver.checkColPlacement(puzzle,row,column,value).result;
        if(!validColumn) conflict.push('column');
        // console.log(validColumn);
        let validRegion = solver.checkRegionPlacement(puzzle,row,column,value).result;
        if(!validRegion) conflict.push('region');
        if(conflict.length===0) {
          res.json({valid:true});
        } else {
          res.json({valid:false,conflict:conflict});
        }
        // console.log(validRegion);
      } catch (err) {
        res.json({ error: err.message });
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      // console.log(req.body);
      if (!req.body.puzzle) {
        res.json({ error: 'Required field missing' });
        return;
      }
      let puzzle = req.body.puzzle;
      try {
        res.json({solution:solver.solve(puzzle)});
      } catch (err) {
        res.json({ error: err.message });
      }
    });
};
