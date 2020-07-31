let currentMap = []; //must be an array()
let gridSize;
let neighbourhood;
let play = false;

function isInside(x, y, w, h) { // checks whether mouse is inside a box of specified size and location
  if(mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
    return true;
  } else {
    return false;
  }
}

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
  check(x, y, grid, neighbourhood) { //returns whether to apply the rule and what state it should be
    let output = [false, this.initialState];
    if (grid.checkCell(x, y) === this.initialState && this.lowerBound <= grid.neighbours(x, y, this.stateOfCells, neighbourhood) && grid.neighbours(x, y, this.stateOfCells, neighbourhood) <= this.upperBound) {
      output = [true, this.finalState];
    }
    return output;
  }
}

class RuleSet {
  constructor(state, rules) {
    this.rules = rules;
    this.states = {}; // adds a record of what the states are
    for (let i in state) {
      this.states[state[i][0]] = state[i][1];
    }
    this.neighbourhood = new Neighbourhood([[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]); // temporary

  }
  addRule(rule) {
    this.rules.push(rule);
  }
  checkRules(x, y, grid) {
    console.log(this.neighbourhood)
    for (let i in this.rules) {
      if (this.rules[i].check(x, y, grid, this.neighbourhood)[0]) {
        return (this.rules[i].check(x, y, grid, this.neighbourhood)[1]);
        break;
      }
    }
    return grid.checkCell(x, y);
  }
}


//game of life
let GOL;
let deathByLonelyness = new Rule(true, 0, 1, true, false);
let deathByCrowding = new Rule(true, 4, 8, true, false);
let birth = new Rule(false, 3, 3, true, true);


// rule 30


class Grid {
  constructor(rows, columns){
    this.cells = constructGrid(rows, columns);
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

  neighbours(x, y, state, neighbourhood) { // returns the amount of neighbours of a given cell in the grid
    let amountOfNeighbours = 0;
    let cellPos = createVector(x, y);
    let cell;

    for (cell in neighbourhood.neighbours) {
      let neighbour = p5.Vector.add(cellPos, neighbourhood.neighbours[cell]);
      if (neighbour.x >= 0 && neighbour.y >= 0 && neighbour.x < this.cells.length && neighbour.y < this.cells.length && this.checkCell(neighbour.x, neighbour.y) === state) {
        amountOfNeighbours++;
      }
    }

    return amountOfNeighbours;

  }
}

function setup() {
  gridSize = createVector(0.7*windowWidth, windowHeight);
  var Canvas = createCanvas(gridSize.x, gridSize.y);
  Canvas.parent('container');
  Canvas.style('position', 'relative');
  Canvas.style('order', '0');
  Canvas.style('top', '0');

  // game of life
  GOL = new RuleSet([['dead', 'white'], ['alive', 'black']], [birth, deathByCrowding, deathByLonelyness]);

  currentMap = new grid(25, GOL);
  currentMap.display();
  // move this later
  for (let state in currentMap.ruleSet.states) {
    $('#statisticBar').append('<div class="square" id="' + state + '"></div>');
    $('#' + state).css('background-color', currentMap.ruleSet.states[state])
  }
}

function grid(cellSize, ruleSet) {
  this.ruleSet = ruleSet;
  this.grid = new Grid(floor(gridSize.x/cellSize), floor(gridSize.y/cellSize), ruleSet.neighbourhood);
  this.cellSize = cellSize;

  this.iterate = () => {
    this.update();
    this.display();
  }

  this.update = () => {
    let newGrid = new Grid(floor(gridSize.x/cellSize), floor(gridSize.y/cellSize));
    for (let cellX = 0; cellX < this.grid.cells.length; cellX++) {
      for (let cellY = 0; cellY < this.grid.cells[cellX].length; cellY++) {
        newGrid.addCell(cellX, cellY, this.ruleSet.checkRules(cellX, cellY, this.grid));
      }
    }
    this.grid = newGrid;
  }

  this.display = () => { // displays the grid on the canvas
    for (let x = 0;  x < this.grid.cells.length; x++) {
      for (let y = 0;  y < this.grid.cells[x].length; y++) {
        let state;
        if (this.grid.checkCell(x, y)) {
          state = 'alive';
        } else {
          state = 'dead';
        }
        // if (x == mouseHoverCellX && y == mouseHoverCellY) {
        //   state.setAlpha(20);
        // }
        fill(this.ruleSet.states[state]);
        square(x * this.cellSize, y * this.cellSize, this.cellSize);
      }
    }
  }
}

// click handling
let clickState; // stores the initial state of a click
var mouseHoverCellX = floor(mouseX/currentMap.cellSize);
var mouseHoverCellY = floor(mouseY/currentMap.cellSize);

function mousePressed() {
  currentMap.grid.flipCellState(mouseHoverCellX, mouseHoverCellY);
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
