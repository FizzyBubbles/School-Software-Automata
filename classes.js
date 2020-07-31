class Neighbourhood {
  constructor(neighbours) { //takes an array of neighbours converts them to vectors
    this.neighbours = [];
    for (let neighbourIndex in neighbours) {
      this.neighbours.push( createVector(neighbours[neighbourIndex][0], neighbours[neighbourIndex][1]) );
    }
  }
  add(x, y) {
    this.neighbours.push(createVector(x, y));
  }
}

class Rule {
  constructor(initialState, lowerBound, upperBound, stateOfCells, finalState) { //
    this.initialState = initialState;
    this.lowerBound = lowerBound;
    this.upperBound = upperBound;
    this.stateOfCells = stateOfCells;
    this.finalState = finalState;
  }
  check(x, y, grid) { //returns whether to apply the rule and what state it should be
    let output = [false, this.initialState];
    if (grid.checkCell(x, y) === this.initialState && this.lowerBound <= grid.neighbours(x, y, this.stateOfCells) && grid.neighbours(x, y, this.stateOfCells) <= this.upperBound) {
      output = [true, this.finalState];
    }
    return output;
  }
}

class RuleSet {
  constructor(state, rules, neighbourhood) {
    this.rules = rules;
    this.neighbourhood = neighbourhood;
    this.states = {}; // adds a record of what the states are
    for (let i in state) {
      this.states[state[i][0]] = state[i][1];
    }

  }

  addRule(rule) {
    this.rules.push(rule);
  }
  checkRules(x, y, grid) {
    for (let i in this.rules) {
      if (this.rules[i].check(x, y, grid)[0]) {
        return (this.rules[i].check(x, y, grid)[1]);
        break;
      }
    }
    return grid.checkCell(x, y);
  }
}

function constructGrid(rows, columns) { // creates a new 2d array using for loops
  let grid = [];
  for (let cellX = 0; cellX < rows; cellX++) {
    let column = [];
    for (let cellY = 0; cellY < columns; cellY++) {
      column.push(false); // adds the default state false into the columns
    }
    grid.push(column);
  }
  return grid;
}
class Grid {
  constructor(rows, columns, neighbourhood){
    this.cells = constructGrid(rows, columns);
    this.neighbourhood = neighbourhood; // temporary
  }
  addCell(x, y, state) {
    this.cells[x][y] = state;
  }
  checkCell(x, y) {
    return this.cells[x][y];
  }
  flipCellState(x, y) {
    this.cells[x][y] = !this.cells[x][y];
  }

  neighbours(x, y, state) { // returns the amount of neighbours of a given cell in the grid
    //neighbourhood = [createVector(-1, -1), createVector(-1, 0), createVector(-1, 1), createVector(0, -1), createVector(0, 1), createVector(1, -1), createVector(1, 0), createVector(1, 1)];
    let amountOfNeighbours = 0;
    let cellPos = createVector(x, y);
    let cell;

    for (cell in this.neighbourhood.neighbours) {
      let neighbour = p5.Vector.add(cellPos, this.neighbourhood.neighbours[cell]);
      if (neighbour.x >= 0 && neighbour.y >= 0 && neighbour.x < this.cells.length && neighbour.y < this.cells.length && this.checkCell(neighbour.x, neighbour.y) === state) {
        amountOfNeighbours++;
      }
    }

    return amountOfNeighbours;

  }
}
