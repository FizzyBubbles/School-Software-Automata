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

const immediateNeighbourhood = new Neighbourhood([[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]);

//game of life

let deathByLonelyness = new Rule(true, 0, 1, true, false);
let deathByCrowding = new Rule(true, 4, 8, true, false);
let birth = new Rule(false, 3, 3, true, true);
const GOL = new RuleSet([['dead', 'white'], ['alive', 'black']], [birth, deathByCrowding, deathByLonelyness], immediateNeighbourhood);

// rule 30


function setup() {
  gridSize = createVector(0.7*windowWidth, windowHeight);
  var Canvas = createCanvas(gridSize.x, gridSize.y);
  Canvas.parent('container');
  Canvas.style('position', 'relative');
  Canvas.style('order', '0');
  Canvas.style('top', '0');
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
  this.grid = new Grid(floor(gridSize.x/cellSize), floor(gridSize.y/cellSize), ruleset.neighbourhood);
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
