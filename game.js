let currentMap = []; //must be an array()
let gridSize;
let neighbourhood;

function setup() {
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
  addCell(x, y, state) {
    console.log(this.cells, state)
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
      if (neighbour.x >= 0 && neighbour.y >= 0 && neighbour.x <= this.cells.length && neighbour.y <= this.cells.length)

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



  this.update = () => {
    let newGrid = new Grid(floor(gridSize.x/cellSize), floor(gridSize.y/cellSize));
    for (cellX in this.grid.cells.length) {
      for (cellY in this.grid.cells[cellX].length) {
        console.log(cellX, cellY)
        switch (this.grid.neighbours(cellX, cellY)) {
          case 2:
            if (this.grid.checkCell(cellX, cellY)){
              this.newGrid.addCell(cellX, cellY, true);
            }
            break;

          case 3:
            console.log(this.grid.checkCell(cellX, cellY), "hey")
            if (!this.grid.checkCell(cellX, cellY)){
              this.newGrid.addCell(cellX, cellY, true)
            }
            break;

          default:
            break;

        }
      }
    }
    console.log(newGrid)
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
}

function draw() {
  //background(0);
  currentMap.display();
}
