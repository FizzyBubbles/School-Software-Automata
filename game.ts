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
const constructGrid = (rows: number, columns:number): Grid => { // creates a new 2d array using for loops
  let gridMatrix = [];
  for (let x = 0; x < rows; x++) {
    let column = [];
    for (let y = 0; y < columns; y++) {
      column.push('dead'); // adds the default state into the columns
    }
    gridMatrix.push(column);
  }
  return {matrix: gridMatrix};
}

// stores the colour mapping from state to colour.
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
  //loop through every position on the grid matrix
  for (let x = 0;  x < grid.matrix.length; x++) {
    for (let y = 0;  y < grid.matrix[x].length; y++) {
      // display each cell
      const currentCellState = getCellStateFromGrid( grid, { x, y } );
      displayCell({
        state: currentCellState,
        pos: { x, y }
      })
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
type Neighbourhood = Vector[];

const getCellNeighbours = (
  grid: Grid,
  coord: Coord,
  neighbourhood: Neighbourhood
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
  neighbourhood: Neighbourhood,
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
  neighbourhood: Neighbourhood;
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
  // iterate through each position in old grid
  // allPositions youll need to provide
  let newGrid: Grid;
  for (let x = 0; x < oldGrid.matrix.length; x++) {
    let column: CellState[];
    for (let y = 0; x < oldGrid.matrix.length[x]; y++) {
       column.push(rule(oldGrid, { x, y }));
    }
    newGrid.matrix.push(column);
  }

  return newGrid;
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
