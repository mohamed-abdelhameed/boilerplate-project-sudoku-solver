
class SudokuSolver {

  validate(puzzleString) {
    if(puzzleString.match(/[^(\d|\.)]/g)) {
      throw new Error('Invalid characters in puzzle');
    }
    if(puzzleString.length!=81) {
      throw new Error('Expected puzzle to be 81 characters long');
    }
    let rowValid = true;
    let columnValid = true;
    let regionValid = true;
    for (let i = 0; i < 9; i++) {
      if (rowValid) rowValid = this.checkRowPlacement(puzzleString, i).result;
      if (columnValid) columnValid = this.checkColPlacement(puzzleString, -1, i).result;
      if (!(rowValid || columnValid)) break;
    }
    for (let i = 0; i < 9; i += 3) {
      for (let j = 0; j < 9; j += 3) {
        if (regionValid) regionValid = this.checkRegionPlacement(puzzleString, i, j).result;
        else break;
      }
    }
    // console.log(rowValid,columnValid,regionValid);
    return rowValid&&columnValid&&regionValid;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let index = row * 9;
    let curRow = puzzleString.slice(index, index + 9);
    let numbers = [...curRow];
    if (value) numbers[column] = value;
    let result = numbers.join('').match(/(\d).*\1/g);
    return { data: curRow, result: !result };
  }

  checkColPlacement(puzzleString, row, column, value) {
    let str = `.{${column}}(.).{${8 - column}}`;
    let curColumn = Array.from(puzzleString.matchAll(new RegExp(str, "g")), m => m[1]);
    if (value) curColumn[row] = value;
    let result = curColumn.join('').match(/(\d).*\1/g);
    return { data: curColumn, result: !result };
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let firstRowInRegion = Math.trunc(row / 3) * 3;
    let index = firstRowInRegion * 9;
    let curRegionRows = puzzleString.slice(index, index + 27);
    let firstColInRegion = Math.trunc(column / 3) * 3;
    let str = `.{${firstColInRegion}}(.{3}).{${6 - firstColInRegion}}`;
    let curRegion = Array.from(curRegionRows.matchAll(new RegExp(str, "g")), m => m[1]).join('');

    let numbers = [...curRegion];
    // console.log(firstRowInRegion,curRegionRows,firstColInRegion,numbers);
    if (value) {
      let indexInRegion = row % 3 * 3 + column % 3;
      numbers[indexInRegion] = value;
    }
    let result = numbers.join('').match(/(\d).*\1/g);
    return { data: curRegion, result: !result };
  }

  solve(puzzleString) {
    let puzzle = puzzleString;
    if(!this.validate(puzzleString)) {
      throw new Error('Puzzle cannot be solved');
    }
    let freeSlots = puzzle.match(/\./g);
    while (freeSlots) {//using test method from RegExp class
      for (let i = 0; i < 9; i += 3) {
        for (let j = 0; j < 9; j += 3) {
          let region = [...(this.checkRegionPlacement(puzzle, i, j).data)];
          // console.log(region);
          let free = region.reduce((result, n, i) => {
            if (n === '.') {
              result.push(i);
              return result;
            }
            return result;
          }, []);
          if (free.length === 0) continue;
          let available = VALUES.filter(n => !region.includes(n));
          for (let k = 0; k < free.length; k++) {
            let row = this.checkRowPlacement(puzzle, i + Math.trunc(free[k] / 3)).data;
            row = [...row].join('').match(/(\d)/g)||[];
            row = VALUES.filter(n => !row.includes(n));

            let col = this.checkColPlacement(puzzle, i, j + Math.trunc(free[k] % 3)).data;
            col = [...col].join('').match(/(\d)/g)||[];
            col = VALUES.filter(n => !col.includes(n));

            let possible = available.filter(n => row.includes(n)).filter(n => col.includes(n));

            let index = (i + Math.trunc(free[k] / 3)) * 9 + (j + Math.trunc(free[k] % 3));
            if (possible.length === 1) {
              puzzle = puzzle.slice(0, index) + possible[0] + puzzle.slice(index + 1);
              available = available.filter(n => !possible.includes(n));
            }

            // console.log('row', row, 'col', col, 'available', available, 'possible', possible, 'puzzle', puzzle);
          }
          // console.log(free, available);
        }
      }
      let curFreeSlots = puzzle.match(/\./g);
      if (!curFreeSlots) {
        break;
      }
      if (curFreeSlots.length<freeSlots.length) {
        //solvable
        freeSlots=curFreeSlots;
      } else {
        throw new Error('Puzzle cannot be solved');
      }
    }
    return puzzle;
  }
}

const VALUES = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

module.exports = SudokuSolver;

