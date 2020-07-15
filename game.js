let currentMap = []; //must be an array()
let gridSize;

function setup() {
  gridSize = createVector(500, 500);
  createCanvas(gridSize.x, gridSize.y);
  currentMap = new grid(50);
}

function constructGrid(cellSize) {
  let grid = [];
  for (let cellX = 0; cellX < floor(gridSize.x/cellSize); cellX++) {
    let column = [];
    for (let cellY = 0; cellY < floor(gridSize.y/cellSize); cellY++) {
      column.push(false);
    }
    grid.push(column);
  }
  return grid;
}

function grid(cellSize) {
  this.cellSize = cellSize;
  this.grid = constructGrid(cellSize);

  this.state = function(cellX, cellY) { // returns the state
    return this.grid[cellX][cellY];
  }

  this.display = function() {
    for (let X = 0;  X < this.grid.length; X++) {
      for (let Y = 0;  Y < this.grid[X].length; Y++) {
        rect(X * this.cellSize, Y * this.cellSize, this.cellSize, this.cellSize);
      }
    }
  }
}

function draw() {
  //background(0);
  currentMap.display();
}
