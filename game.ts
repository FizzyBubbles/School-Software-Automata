let currentMap = []; //must be an array()
let gridSize;
let neighbourhood;
let play = false;

function keyPressed() {
  // plays and pauses simulation
  if (keyCode === 32 && play) {
    play = false;
  } else if (keyCode === 32) {
    play = true;
  }

  // open and close sideMenu
  if (keyCode === 13 && document.getElementById('sideMenu').style.width !== '30%') {
    $('#sideMenu').css('width', '30%');
  } else if (keyCode === 13) {
    $('#sideMenu').css('width', '0%');
  }

}

//
// class Neighbourhood {
//   constructor(neighbours) { //takes an array of neighbours
//     this.neighbours = [neighbours];
//   }
//   add(x, y) { // add edge case of double inputs
//     this.neighbours.push([x, y]);
//   }
//   remove(x, y) {
//     this.neighbours = removeElement([x, y])
//   }
// }
//
// class Rule {
//   constructor(initialState, lowerBound, upperBound, stateOfCells, finalState, neighbourhood) { //
//     this.initialState = initialState;
//     this.lowerBound = lowerBound;
//     this.upperBound = upperBound;
//     this.stateOfCells = stateOfCells;
//     this.finalState = finalState;
//     this.neighbourhood = neighbourhood;
//   }
//   check(x, y, grid, neighbourhood) { //returns whether to apply the rule and what state it should be
//     let output = [false, this.initialState];
//     if (grid.checkCell(x, y) === this.initialState && this.lowerBound <= grid.neighbours(x, y, this.stateOfCells, neighbourhood) && grid.neighbours(x, y, this.stateOfCells, neighbourhood) <= this.upperBound) {
//       output = [true, this.finalState];
//     }
//     return output;
//   }
// }

// class RuleSet {
//   constructor(state, rules) {
//     this.rules = rules;
//     this.states = {}; // adds a record of what the states are
//     for (let i in state) {
//       this.states[state[i][0]] = state[i][1];
//     }
//     this.neighbourhood = mooreNeighbourhood // temporary
//
//   }
//   addRule(rule) {
//     this.rules.push(rule);
//   }
//   checkRules(x, y, grid) {
//     for (let i in this.rules) {
//       if (this.rules[i].check(x, y, grid, this.neighbourhood)[0]) {
//         return (this.rules[i].check(x, y, grid, this.neighbourhood)[1]);
//         break;
//       }
//     }
//     return grid.checkCell(x, y);
//   }
// }

let mooreNeighbourhood = new Neighbourhood([[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]);

//game of life
let GOL;
let deathByLonelyness = new Rule(true, 0, 1, true, false, mooreNeighbourhood);
let deathByCrowding = new Rule(true, 4, 8, true, false, mooreNeighbourhood);
let birth = new Rule(false, 3, 3, true, true, mooreNeighbourhood);


//brians brain
let BB;
let BBirth = ['dead']

function constructGrid(rows, columns) { // creates a new 2d array using for loops
  let grid = [];
  for (let cellX = 0; cellX < rows; cellX++) {
    let column = [];
    for (let cellY = 0; cellY < columns; cellY++) {
      column.push('dead'); // adds the default state into the columns
    }
    grid.push(column);
  }
  return grid;
}

// class Grid {
//   constructor(rows, columns){
//     this.cells = constructGrid(rows, columns);
//   }
//   checkCell(x, y) {
//     return this.cells[x][y];
//   }
//   neighbours(x, y, state, neighbourhood) { // returns the amount of neighbours of a given cell in the grid
//     let amountOfNeighbours = 0;
//     let cellPos = createVector(x, y);
//     let cell;
//
//     for (cell in neighbourhood.neighbours) {
//       let neighbour = p5.Vector.add(cellPos, neighbourhood.neighbours[cell]);
//       if (neighbour.x >= 0 && neighbour.y >= 0 && neighbour.x < this.cells.length && neighbour.y < this.cells.length && this.checkCell(neighbour.x, neighbour.y) === state) {
//         amountOfNeighbours++;
//       }
//     }
//
//     return amountOfNeighbours;
//
//   }
// }
//
// function grid(cellSize, ruleSet) {
//   // this.ruleSet = ruleSet;
//   // this.grid = new Grid( floor(gridSize.x/cellSize), floor(gridSize.y/cellSize), ruleSet.neighbourhood);
//   // this.cellSize = cellSize;
//   //
//   // this.iterate = () => {
//   //   this.update();
//   //   this.display();
//   // }
//
//   // this.update = () => {
//   //   let newGrid = new Grid(floor(gridSize.x/cellSize), floor(gridSize.y/cellSize));
//   //   for (let cellX = 0; cellX < this.grid.cells.length; cellX++) {
//   //     for (let cellY = 0; cellY < this.grid.cells[cellX].length; cellY++) {
//   //       newGrid.addCell(cellX, cellY, this.ruleSet.checkRules(cellX, cellY, this.grid));
//   //     }
//   //   }
//   //   this.grid = newGrid;
//   // }
//   //
//   // this.display = () => { // displays the grid on the canvas
//   //   for (let x = 0;  x < this.grid.cells.length; x++) {
//   //     for (let y = 0;  y < this.grid.cells[x].length; y++) {
//   //       let state;
//   //       if (this.grid.checkCell(x, y)) {
//   //         state = 'alive';
//   //       } else {
//   //         state = 'dead';
//   //       }
//   //       // if (x == mouseHoverCellX && y == mouseHoverCellY) {
//   //       //   state.setAlpha(20);
//   //       // }
//   //       fill(this.ruleSet.states[state]);
//   //       square(x * this.cellSize, y * this.cellSize, this.cellSize);
//   //     }
//   //   }
//   // }
// }

var colourLibrary = {'dead': 'black', 'alive': 'white'};

const getStateColour = (state: CellState) => colourLibrary[state];
const cellSize = 10;

const displayCell = (cell: Cell) => {
  // figure out what colour the state should be
  const cellColour = getStateColour(cell.state);
  fill(cellColour);
  // draw a square at the position of the cell
  square(cell.pos.x * cellSize, cell.pos.y * cellSize, cellSize);

};

const displayGrid = (grid:Grid) => {
  for (let x = 0;  x < grid.matrix.length; x++) {
    for (let y = 0;  y < grid.matrix[x].length; y++) {
      // let state;
      // if (this.grid.checkCell(x, y){
      //   state = 'alive';
      // } state = 'dead';
      // fill(this.ruleSet.states[state]);
      // square(x * this.cellSize, y * this.cellSize, this.cellSize);
      displayCell({ state: getCellStateFromGrid( grid, { x, y } ), pos: { x, y } })
    }
  }
};
// new shit

type CellState = string;

type Cell = {
  pos: Coord;
  state: CellState;
};

type Coord = {
  x: number;
  y: number;
};
type Vector = {
  x: number;
  y: number;
};
type Grid = {
  matrix: CellState[][];
};

const getCellNeighbours = (
  grid: Grid,
  coord: Coord,
  neighbourhood: Vector[]
): CellState[] => {
  const { x, y } = coord;
  // Returns all CellStates around a coordinate
  return neighbourhood.map(
    (v: Vector): CellState => {
      return grid.matrix[x + v.x][y + v.y];
    }
  );
};

const getNumNeighboursWithState = (
  grid: Grid,
  coord: Coord,
  neighbourhood: Vector[],
  desiredState: CellState
): number => {
  // goes through every cell in neighbour
  const neighbours = getCellNeighbours(grid, coord, neighbourhood);

  /* const neighboursWithState = neighbours.filter( */
  /*   (neighbourCellState: CellState) => neighbourCellState === desiredState */
  /* ); */
  const neighboursWithState = neighbours.filter(isState(desiredState));

  return neighboursWithState.length;
};

const getCellStateFromGrid = (grid: Grid, { x, y }: Coord) => grid.matrix[x][y];


type Bound = {
  lower: number;
  upper: number;
};
type RuleParameters = {
  initialCellState: CellState;
  finalCellState: CellState;
  desiredStateCountBounds: Bound;
  neighbourhood: Vector[];
  requiredNeighbourState: CellState;
};
type RuleFunction = (grid: Grid, coord: Coord) => CellState;


// takes in two states and returns boolean based on whether they are the same.
const isState = (desiredState: CellState) => (cellState: CellState) => cellState === desiredState;

const createRule = (params: RuleParameters) => {
  const {
    initialCellState,
    finalCellState,
    desiredStateCountBounds,
    neighbourhood,
    requiredNeighbourState,
  } = params;

  const rule = (grid: Grid, coord: Coord): CellState => {
    // don't apply if initial cell not initialCellState
    const currentCellState = getCellStateFromGrid(grid, coord);
    if (currentCellState !== initialCellState) return currentCellState;

    // count neighbours in neighbourhood with specific state
    const neighboursWithStateCount = getCellNeighbours(
      grid,
      coord,
      neighbourhood
    ).filter(isState(requiredNeighbourState)).length;

    // if this count is within desired bounds, return finalCellState
    if (
      neighboursWithStateCount > desiredStateCountBounds.lower &&
      neighboursWithStateCount < desiredStateCountBounds.upper
    ) {
      return finalCellState;
    }
    // if this count is not withing desired bounds, return initialCellState
    return initialCellState;
  };
  return rule;
};

const applyRule = (oldGrid: Grid, rule: RuleFunction): Grid => {
  // create new grid based on applying the rule
  const newGrid: Grid = { matrix: [[]] };
  // iterate through each position in old grid
  // allPositions youll need to provide
  for (x in (0).WIDTH) {
    for (y in (0).HEIGHT) {
      newGrid[x][y] = rule(oldGrid, { x, y });
    }
  }
};

type RuleSet = RuleFunction[];

//takes in a ruleset and a grid and applies all rules of the RuleSet to the Grid
const updateGrid = (oldGrid: Grid, ruleSet: RuleSet) => ruleSet.reduce(
  (grid: Grid, rule: RuleFunction) => applyRule(grid, rule),
  oldGrid
);

function setup() {
  var Canvas = createCanvas(0.7*windowWidth, windowHeight);
  Canvas.parent('container');
  Canvas.style('position', 'relative');
  Canvas.style('order', '0');
  Canvas.style('top', '0');

  // game of life
  GOL = new RuleSet([['dead', 'white'], ['alive', 'black']], [birth, deathByCrowding, deathByLonelyness]);
  BB = new RuleSet([['dead', 'white'], ['dying', 'blue'], ['alive', 'black']], [])

  currentMap = new grid(25, GOL);
  currentMap.display();
  // move this later
  for (let state in currentMap.ruleSet.states) {
    $('#statisticBar').append('<div class="square" id="' + state + '"></div>');
    $('#' + state).css('background-color', currentMap.ruleSet.states[state]);
  }
}


// click handling
let clickState = 'dead'; // stores the initial state of a click
var mouseHoverCellX = floor(mouseX/currentMap.cellSize);
var mouseHoverCellY = floor(mouseY/currentMap.cellSize);

function mousePressed() {
  if (Object.keys(currentMap.ruleSet.states).length == 2) {
    currentMap.grid.addCell(mouseHoverCellX, mouseHoverCellY, Object.keys(currentMap.ruleSet.states));
  }
  clickState = currentMap.grid.checkCell(mouseHoverCellX, mouseHoverCellY);
  currentMap.display();

}

function mouseDragged() {
  currentMap.grid.addCell(mouseHoverCellX, mouseHoverCellY, clickState);
  currentMap.display();
}



function draw() {
  mouseHoverCellX = floor(mouseX/currentMap.cellSize);
  mouseHoverCellY = floor(mouseY/currentMap.cellSize);
  if (frameCount%10 == 0 && play) {
    currentMap.iterate();
  } else {
    currentMap.display();
  }
}
