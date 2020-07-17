let currentMap = []; //must be an array()
let gridSize;
let neighbourhood;

function setup() {
  neighbourhood = [createVector(-1, -1), createVector(-1, 0), createVector(-1, 1), createVector(0, -1), createVector(0, 1), createVector(1, -1), createVector(1, 0), createVector(1, 1)];
  gridSize = createVector(500, 500);
  createCanvas(gridSize.x, gridSize.y);
  currentMap = new grid(50);

}

function isInside(x, y, w, h){
  if(mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
    return true;
  } else {
    return false;
  }
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

  this.cellState = (cellX, cellY) => { // returns the state
    return this.grid[cellX][cellY];
  }

  this.neighbours = (x, y) => {
    let amountOfNeighbours = 0;
    let cellPos = createVector(x, y);

    for (cell in neighbourhood) {
      let neighbour = p5.Vector.add(cellPos, neighbourhood[cell]);
      if (this.cellState(neighbour.x, neighbour.y)) {
        amountOfNeighbours++;
      }
    }
    return amountOfNeighbours;

  }

  this.update = () => {
    for (cellX in this.grid) {
      for (cellY in this.grid[cellX]) {
        if (this.cellState(cellX, cellY)) {
        }
      }
    }
  }

  this.display = () => { // displays the grid on the canvas
    for (let x = 0;  x < this.grid.length; x++) {
      for (let y = 0;  y < this.grid[x].length; y++) {
        rect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
      }
    }
  }
}

function draw() {
  //background(0);
  currentMap.display();
}
