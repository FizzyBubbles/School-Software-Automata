let currentMap = []; //must be an array()
let gridSize;
let neighbourhood;
let play = false;
function setup() {
  gridSize = createVector(500, 500);
  createCanvas(gridSize.x, gridSize.y);
  currentMap = new grid(25);
  currentMap.display();
}

function isInside(x, y, w, h) { // checks whether mouse is inside a box of specified size and location
  if(mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
    return true;
  } else {
    return false;
  }
}

function keyPressed() {
  if (keyCode === 32 && play) {
    play = false;
  } else if (keyCode === 32) {
    play = true;
  }
}

function constructGrid(rows, columns) { // creates a new 2d array using for loops
  let grid = [];
  for (let cellX = 0; cellX < rows; cellX++) {
    let column = [];
    for (let cellY = 0; cellY < columns; cellY++) {
      column.push(false); // adds the default state false into the columns
    }
    grid.push(column); //
  }
  return grid;
}

class Grid {
  constructor(rows, columns){
    this.cells = constructGrid(rows, columns)
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
  neighbours(x, y) {
    neighbourhood = [createVector(-1, -1), createVector(-1, 0), createVector(-1, 1), createVector(0, -1), createVector(0, 1), createVector(1, -1), createVector(1, 0), createVector(1, 1)];
    let amountOfNeighbours = 0;
    let cellPos = createVector(x, y);
    let cell;

    for (cell in neighbourhood) {
      let neighbour = p5.Vector.add(cellPos, neighbourhood[cell]);
      if (neighbour.x >= 0 && neighbour.y >= 0 && neighbour.x < this.cells.length && neighbour.y < this.cells.length)

        if (this.checkCell(neighbour.x, neighbour.y)) {
          amountOfNeighbours++;
        }

    }

    return amountOfNeighbours;

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

  this.iterate = () => {
    this.update();
    this.display();
  }

  this.update = () => {
    let newGrid = new Grid(floor(gridSize.x/cellSize), floor(gridSize.y/cellSize));
    for (let cellX = 0; cellX < this.grid.cells.length; cellX++) {
      for (let cellY = 0; cellY < this.grid.cells[cellX].length; cellY++) {
        switch (this.grid.neighbours(cellX, cellY)) {
          case 2:

            if (this.grid.checkCell(cellX, cellY)){
              newGrid.addCell(cellX, cellY, true);
            }
            break;

          case 3:
            newGrid.addCell(cellX, cellY, true)

            break;

          default:
            break;

        }
      }
    }
    this.grid = newGrid;
  }

  this.display = () => { // displays the grid on the canvas
    for (let x = 0;  x < this.grid.cells.length; x++) {
      for (let y = 0;  y < this.grid.cells[x].length; y++) {
        if (this.grid.checkCell(x, y)) {
          fill('black');
        } else {
          fill('white');
        }
        square(x * this.cellSize, y * this.cellSize, this.cellSize);
      }
    }
  }
}


function mousePressed() {
  let cellX = floor(mouseX/currentMap.cellSize);
  let cellY = floor(mouseY/currentMap.cellSize);
  currentMap.grid.flipCellState(cellX, cellY);
  currentMap.display();
}


function draw() {
  //background(0);
  if (frameCount%10 == 0 && play) {
    currentMap.iterate();
  }
}
