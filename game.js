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

function constructGrid(rows, columns) {
  let grid = [];
  for (let cellX = 0; cellX < rows; cellX++) {
    let column = [];
    for (let cellY = 0; cellY < columns; cellY++) {
      column.push(false);
    }
    grid.push(column);
  }
  return grid;
}

class Grid {
  constructor(rows, columns){
    this.cells = constructGrid(rows, columns)
  }
}

function grid(cellSize, rows, columns) {
  this.grid;
  if (rows && columns) {
    this.grid = new Grid(rows, columns);
  } else {
    this.grid = new Grid(floor(gridSize.x/cellSize), floor(gridSize.y/cellSize));
  }
  this.cellSize = cellSize;


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
    let newGrid = []
    for (cellX in this.grid) {
      let column = [];
      for (cellY in this.grid[cellX]) {
        column.push(false);
        if (this.cellState(cellX, cellY)) {
          switch (this.neighbours(cellX, cellY)) {
            case 2:
              column.push(this.cellState(cellX, cellY));
              break;

            case 3:
              if (!this.cellState(cellX, cellY)){
                column.push(true);
              }
              break;

            default:
              column.push(false);
              break;

          }
        }
      }
      newGrid.push(column);
    }
    this.grid = newGrid
  }

  this.display = () => { // displays the grid on the canvas
    for (let x = 0;  x < this.grid.length; x++) {
      for (let y = 0;  y < this.grid[x].length; y++) {
        if (this.cellState(x, y)) {
          fill('black');
        } else {
          fill('white');
        }
        square(x * this.cellSize, y * this.cellSize, this.cellSize);
      }
    }
  }
  this.changeCellState = (cellX, cellY, state) => {
    this.grid[cellX][cellY] = state;
  }
  this.flipChangeState = (cellX, cellY) => {
    this.changeCellState(cellX, cellY, !this.cellState(cellX, cellY));
  }
}

function mousePressed() {
  let cellX = floor(mouseX/currentMap.cellSize);
  let cellY = floor(mouseY/currentMap.cellSize);
  currentMap.flipChangeState(cellX, cellY);
}

function draw() {
  //background(0);
  currentMap.display();
}
