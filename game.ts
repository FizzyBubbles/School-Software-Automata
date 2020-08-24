import $ from "jquery";
import p5 from "p5";

// GLOBALS
var gridSize: Vector;
var gameGrid: Grid;
var mooreNeighbourhood: Neighbourhood;

var play: boolean = false;

var GOL: RuleSet;

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
export type Neighbourhood = Vector[];
export type RuleFunction = (
  cellState: CellState,
  neighbourhood: CellState[]
) => CellState;
export type RuleSet = {
  rules: RuleFunction[];
  neighbourhood: Neighbourhood;
};

type Bound = {
  lower: number;
  upper: number;
};
type RuleParameters = {
  initialCellState: CellState;
  finalCellState: CellState;
  desiredStateCountBounds: Bound;
  requiredNeighbourState: CellState;
};

const isWithinBounds = (n: number, bounds: Bound) =>
  bounds.lower <= n && n <= bounds.upper;

const getCellStateFromGrid = (grid: Grid, { x, y }: Coord) => grid.matrix[x][y];

// takes in two states and returns boolean based on whether they are the same.
const isState = (desiredState: CellState) => (cellState: CellState) =>
  cellState === desiredState;

// const applyRule = (oldGrid: Grid, rule: RuleFunction): Grid => {
//   // create new grid based on applying the rule
//   // iterate through each position in old grid
//   // allPositions youll need to provide
//   let newGrid: CellState[][] = [];
//   for (let x = 0; x < oldGrid.matrix.length; x++) {
//     let column: CellState[] = [];
//     for (let y = 0; y < oldGrid.matrix[x].length; y++) {
//       const newCell = rule(oldGrid, { x: x, y: y });
//       column.push(newCell);
//     }
//     newGrid.push(column);
//   }
//
//   return { matrix: newGrid };
// };

const getCellNeighbours = (
  grid: Grid,
  coord: Coord,
  neighbourhood: Neighbourhood
): CellState[] => {
  const { x, y } = coord;
  // Returns all CellStates around a coordinate
  const effectiveNeighbourhood = neighbourhood.filter((v: Vector) => {
    if (
      isWithinBounds(x + v.x, {
        lower: 0,
        upper: gridSize.x - 1,
      }) &&
      isWithinBounds(y + v.y, {
        lower: 0,
        upper: gridSize.y - 1,
      })
    ) {
      return true;
    }
    return false;
  });
  return effectiveNeighbourhood.map(
    (v: Vector): CellState => {
      return grid.matrix[x + v.x][y + v.y];
    }
  );
};

export const createRule = (params: RuleParameters) => {
  const {
    initialCellState,
    finalCellState,
    desiredStateCountBounds,
    requiredNeighbourState,
  } = params;

  // creates anonymous rule function that takes in a cell state and neighbourhood and returns the value of the cell if the rule was applied to just that cell
  const rule = (
    cellState: CellState,
    neighbourhood: CellState[]
  ): CellState => {
    // don't apply if initial cell not initialCellState
    const isDesiredState = isState(requiredNeighbourState);
    if (cellState !== initialCellState) {
      return cellState;
    }
    // count neighbours in neighbourhood with specific state
    const neighboursWithStateCount = neighbourhood.filter(
      (n: CellState): boolean => isDesiredState(n)
    ).length;

    // if this count is within desired bounds, return finalCellState
    if (isWithinBounds(neighboursWithStateCount, desiredStateCountBounds)) {
      return finalCellState;
    }
    // if this count is not withing desired bounds, return initialCellState
    return cellState;
  };

  return rule;
};

const sketch = (sk: any) => {
  sk.keyPressed = () => {
    // plays and pauses simulation
    if (sk.keyCode === 32) {
      if (play) {
        play = false;
      } else {
        play = true;
      }
    }

    // open and close sideMenu
    if (
      sk.keyCode === 13 &&
      document.getElementById("sideMenu")?.style.width !== "30%"
    ) {
      $("#sideMenu").css("width", "30%");
    } else if (sk.keyCode === 13) {
      $("#sideMenu").css("width", "0%");
    }
  };
  const constructGrid = (rows: number, columns: number): Grid => {
    // creates a new 2d array using for loops
    let gridMatrix = [];
    for (let x = 0; x < rows; x++) {
      let column = [];
      for (let y = 0; y < columns; y++) {
        column.push("dead"); // adds the default state into the columns
      }
      gridMatrix.push(column);
    }
    return { matrix: gridMatrix };
  };

  // stores the colour mapping from state to colour.
  var colourLibrary: { [key: string]: string } = {
    dead: "black",
    alive: "white",
  };

  const getStateColour = (state: CellState) => colourLibrary[state];
  const cellSize = 20;

  const displayCell = (cell: Cell) => {
    // figure out what colour the state should be
    const cellColour = getStateColour(cell.state);
    sk.fill(cellColour);
    // draw a square at the position of the cell
    sk.square(cell.pos.x * cellSize, cell.pos.y * cellSize, cellSize);
  };

  const displayGrid = (grid: Grid) => {
    //loop through every position on the grid matrix
    for (let x = 0; x < grid.matrix.length; x++) {
      for (let y = 0; y < grid.matrix[x].length; y++) {
        // display each cell
        const currentCellState = getCellStateFromGrid(grid, { x, y });
        displayCell({
          state: currentCellState,
          pos: { x, y },
        });
      }
    }
  };
  // new shit

  const ruleSetCheck = (
    ruleSet: RuleSet,
    oldGrid: Grid,
    coord: Coord
  ): CellState => {
    const initialCellState = getCellStateFromGrid(oldGrid, coord);
    const neighbourhood = getCellNeighbours(
      oldGrid,
      coord,
      ruleSet.neighbourhood
    );
    for (let i = 0; i < ruleSet.rules.length; i++) {
      if (
        ruleSet.rules[i](initialCellState, neighbourhood) !== initialCellState
      ) {
        // console.log(ruleSet.rules[i](oldGrid, coord), coord, i);
        return ruleSet.rules[i](initialCellState, neighbourhood);
      }
    }
    return initialCellState;
  };

  //takes in a ruleset and a grid and applies all rules of the RuleSet to the Grid
  const updateGrid = (oldGrid: Grid, ruleSet: RuleSet): Grid => {
    // ruleSet.reduce(
    // (grid: Grid, rule: RuleFunction) => applyRule(grid, rule),
    // oldGrid );
    let updatedGrid: string[][] = [];
    // iterate through each Cell in oldGrid
    for (let x = 0; x < oldGrid.matrix.length; x++) {
      // for each cell apply iterate through every rule from ruleSet. (none should overlap)
      let column: CellState[] = [];
      for (let y = 0; y < oldGrid.matrix[x].length; y++) {
        // ruleSet.map((rule: RuleFunction) => rule(oldGrid, { x, y }))
        const currentCoord: Coord = { x, y };
        column.push(ruleSetCheck(ruleSet, oldGrid, currentCoord));
      }
      // add result to new array
      updatedGrid.push(column);
    }
    return { matrix: updatedGrid };
  };

  const iterateAndDisplayGrid = (oldGrid: Grid, ruleSet: RuleSet): Grid => {
    const newGrid = updateGrid(oldGrid, ruleSet);
    displayGrid(newGrid);
    return newGrid;
  };

  sk.setup = () => {
    var Canvas = sk.createCanvas(0.7 * sk.windowWidth, sk.windowHeight);
    Canvas.parent("container");
    Canvas.style("position", "relative");
    Canvas.style("order", "0");
    Canvas.style("top", "0");
    // gridSize = {
    //   x: Math.floor(sk.windowWidth) * 0.7,
    //   y: Math.floor(sk.windowHeight) * 0.7,
    // };
    gridSize = {
      x: 20,
      y: 20,
    };
    gameGrid = constructGrid(gridSize.x, gridSize.y);
    mooreNeighbourhood = [
      { x: -1, y: -1 },
      { x: -1, y: 0 },
      { x: -1, y: 1 },
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: 1, y: -1 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ];
    const deathByLonelyness: RuleFunction = createRule({
      initialCellState: "alive",
      finalCellState: "dead",
      desiredStateCountBounds: { lower: 0, upper: 1 },
      requiredNeighbourState: "alive",
    });
    const deathByCrowding: RuleFunction = createRule({
      initialCellState: "alive",
      finalCellState: "dead",
      desiredStateCountBounds: { lower: 4, upper: 8 },
      requiredNeighbourState: "alive",
    });
    const birth: RuleFunction = createRule({
      initialCellState: "dead",
      finalCellState: "alive",
      desiredStateCountBounds: { lower: 3, upper: 3 },
      requiredNeighbourState: "alive",
    });

    GOL = {
      rules: [deathByLonelyness, deathByCrowding, birth],
      neighbourhood: mooreNeighbourhood,
    };

    // move this later
    // for (let state in GOL) {
    //   $('#statisticBar').append('<div class="square" id="' + state + '"></div>');
    //   $('#' + state).css('background-color', currentMap.ruleSet.states[state]);
    // }
  };

  // click handling
  let clickState = "alive"; // stores the initial state of a click
  var mouseHoverCellX = Math.floor(sk.mouseX / cellSize);
  var mouseHoverCellY = Math.floor(sk.mouseY / cellSize);

  sk.mousePressed = () => {
    gameGrid.matrix[Math.floor(sk.mouseX / cellSize)][
      Math.floor(sk.mouseY / cellSize)
    ] = clickState;
  };

  function mouseDragged() {
    // currentMap.grid.addCell(mouseHoverCellX, mouseHoverCellY, clickState);
    // currentMap.display();
  }

  sk.draw = () => {
    mouseHoverCellX = Math.floor(sk.mouseX / cellSize);
    mouseHoverCellY = Math.floor(sk.mouseY / cellSize);
    if (sk.frameCount % 10 == 0) {
      if (play) {
        gameGrid = updateGrid(gameGrid, GOL);
      }
      displayGrid(gameGrid);
    }
    //gameGrid = updatedGrid;
  };
};

new p5(sketch);
