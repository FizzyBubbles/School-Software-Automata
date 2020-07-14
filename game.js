let currentMap = []; //must be an array()
let gridSize;

function setup() {
  gridSize = createVector(500, 500);
  createCanvas(gridSize.x, gridSize.y);
}

function newGrid(cellSize) {
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

function draw() {
  background(0);
}
