import $ from "jquery";
import p5, { Color } from "p5";
import _ from "lodash";

// CONSTANTS
const UI_RATIO = 0.3;
const CELL_SIZE = 20;
const FRAME_RATE = 60;

const mooreNeighbourhood: Neighbourhood = [
  { x: -1, y: -1 },
  { x: -1, y: 0 },
  { x: -1, y: 1 },
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: 1, y: -1 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
];

// GLOBALS
var gridSize: Vector;
var gameGrid: Grid;
var gridHasChanged = true;
var updateFrameRate = 5; // how many frames per udate

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
  states: CellState[];
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

const randomInt = (max: number): number =>
  Math.floor(Math.random() * Math.floor(max));

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
const snapNumber = (float: number, length: number): number =>
  Math.floor(float * length);

const randomGrid = (states: CellState[]): Grid => {
  let gridMatrix = [];
  for (let x = 0; x < gameGrid.matrix.length; x++) {
    let column = [];
    for (let y = 0; y < gameGrid.matrix[x].length; y++) {
      column.push(states[randomInt(states.length)]); // adds random state to columns
    }
    gridMatrix.push(column);
  }
  return { matrix: gridMatrix };
};

const effectiveNeighbourhood = (
  coord: Coord,
  neighbourhood: Neighbourhood
): Neighbourhood => {
  const { x, y } = coord;
  return neighbourhood.filter((v: Vector) => {
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
};

const getNeighbourCoords = (
  coord: Coord,
  neighbourhood: Neighbourhood
): Coord[] => {
  return effectiveNeighbourhood(coord, neighbourhood).map(
    (v: Vector): Coord => ({ x: v.x + coord.x, y: v.y + coord.y })
  );
};

const getCellNeighbours = (
  grid: Grid,
  coord: Coord,
  neighbourhood: Neighbourhood
): CellState[] => {
  // Returns all CellStates around a coordinate
  return getNeighbourCoords(coord, neighbourhood).map(
    (c: Coord): CellState => getCellStateFromGrid(grid, c)
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

// perlin noise map function
var py = 0; // perlin noise y position
var px = 0; // perlin noise x position
const sketch = (sk: any) => {
  const perlinGrid = (states: CellState[]): Grid => {
    let gridMatrix = [];

    for (let x = 0; x < gameGrid.matrix.length; x++) {
      let column = [];
      px += 0.2;
      for (let y = 0; y < gameGrid.matrix[x].length; y++) {
        py += 0.4;
        column.push(states[snapNumber(sk.noise(px, py), states.length)]); // adds the assigned snapped perlin noise function value to the array
      }
      gridMatrix.push(column);
    }
    return { matrix: gridMatrix };
  };

  const setGameGrid = (newGrid: Grid): void => {
    // hides my mutible crimes :)
    gridHasChanged = true;
    gameGrid = newGrid;
  };

  sk.keyPressed = () => {
    // plays and pauses simulation
    if (sk.keyCode === 32) {
      togglePlay();
    }
    // sets grid to perlin noise grid
    if (sk.keyCode === 80) {
      setGameGrid(perlinGrid(["dead", "alive"]));
    }
    // sets grid to random grid
    if (sk.keyCode === 82) {
      setGameGrid(randomGrid(["dead", "alive"]));
    }
    if (sk.keyCode === 73) {
      setGameGrid(iterateAndDisplayGrid(gameGrid, GOL));
    }
    if (sk.keyCode === 67) {
      reset();
    }

    // open and close sideMenu
    if (sk.keyCode === 13) {
      if (document.getElementById("sideMenu")?.style.width !== "30%") {
        $("#sideMenu").css("width", "30%"); // sets side menu width to 30%
      } else {
        $("#sideMenu").css("width", "0%"); // sets side menu width to 0%
      }
    }
    if (
      (sk.keyCode >= 48 && sk.keyCode <= 57) ||
      (sk.keyCode >= 96 && sk.keyCode <= 104)
    ) {
      setClickState(sk.key % 2, ["dead", "alive"]);
    }
  };

  // stores the colour mapping from state to colour.
  var colourLibrary: { [key: string]: string } = {
    dead: "black",
    alive: "white",
  };

  const getStateColor = (state: CellState) => colourLibrary[state];

  const displayCell = (cell: Cell) => {
    // figure out what colour the state should be
    const cellColor = getStateColor(cell.state);
    sk.fill(cellColor);
    // draw a square at the position of the cell
    sk.square(cell.pos.x * CELL_SIZE, cell.pos.y * CELL_SIZE, CELL_SIZE);
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

  const invertColor = (c: Color): Color => sk.color(255-sk.red(c), 255-sk.green(c), 255-sk.blue(c));

  const displayStatesOnSideMenu = (ruleSet: RuleSet): void => {
    ruleSet.states.forEach((state:CellState) => {
      $("#statisticBar").append(
        '<div class="square" id=' + state + '>' + state + '</div>'
      );
      $("#" + state).css("background-color", sk.color(getStateColor(state)));
      //console.log(sk.color(getStateColor(state)))
      const inverseColor: Color = invertColor(sk.color(getStateColor(state)));
      $("#" + state).css("color", inverseColor);
    });
  }
  sk.setup = () => {
    var Canvas = sk.createCanvas(sk.windowWidth, sk.windowHeight);
    sk.frameRate(FRAME_RATE);
    Canvas.parent("container");
    Canvas.style("position", "relative");
    Canvas.style("order", "0");
    Canvas.style("top", "0");
    Canvas.id("Canvas");
    gridSize = {
      x: Math.floor(sk.windowWidth / CELL_SIZE), // gets the amount of cells you can fit in the x axis
      y: Math.floor(sk.windowHeight / CELL_SIZE), // gets the amount of cells you can fit in the y axis
    };
    setGameGrid(constructGrid(gridSize.x, gridSize.y)); // creates grid

    
    // Game of life rule set
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
      states: ["dead", "alive"],
    };

    displayStatesOnSideMenu(GOL);

  };

  // click handling
  let clickState = "alive"; // stores the initial state of a click

  const setClickState = (position: number, cellStates: CellState[]): void => {
    clickState = cellStates[position];
  };

  // window.addEventListener("wheel", _.throttle(jumpUp, 500, { leading: true }));
  const setGridCellState = (oldGrid: Grid, coord: Coord): void => {
    oldGrid.matrix[coord.x][coord.y] = clickState;
    gridHasChanged = true;
  };
  const mouseTileOver = (): Coord => ({
    x: Math.floor(sk.mouseX / CELL_SIZE),
    y: Math.floor(sk.mouseY / CELL_SIZE),
  });

  sk.mousePressed = () => {
    // turns off placement when clicking on menu
    if ($("#sideMenu:hover").length === 0) {
      setGridCellState(gameGrid, mouseTileOver());
    }
  };

  sk.mouseDragged = () => {
    // turns off placement when dragging on menu
    if (getCellStateFromGrid(gameGrid, mouseTileOver()) !== clickState && $("#sideMenu:hover").length === 0) {
      setGridCellState(gameGrid, mouseTileOver());
    };
  };

  let oldMousePosition: Coord;
  sk.draw = () => {
    if (gridHasChanged) {
      displayGrid(gameGrid);
      gridHasChanged = false;
      console.log("redraw");
    }

    // clear old mouse position
    if (oldMousePosition) {
      sk.push();
      const mouseNeighbourHood = [...mooreNeighbourhood, { x: 0, y: 0 }];
      getNeighbourCoords(oldMousePosition, mouseNeighbourHood).forEach(
        (coord: Coord) => {
          displayCell({
            pos: coord,
            state: getCellStateFromGrid(gameGrid, coord),
          });
        }
      );
      sk.pop();
    }
    sk.push();
    sk.fill(getStateColor(clickState));

    sk.circle(sk.mouseX, sk.mouseY, 10);

    oldMousePosition = mouseTileOver();
    sk.pop();
    if (sk.frameCount % updateFrameRate == 0) {
      if (play) {
        setGameGrid(updateGrid(gameGrid, GOL));
      }
    }
    //gameGrid = updatedGrid;
  };

  // reset function
  const reset = () => {
    // sets the game grid to a dead cell state grid (empty)
    setGameGrid(constructGrid(gridSize.x, gridSize.y));
  };

  const rand = () => {
    //sets the game grid to a random grid
    setGameGrid(randomGrid(['dead', 'alive']));
  }

  $("#iterateButton").on("click", () => {
    setGameGrid(iterateAndDisplayGrid(gameGrid, GOL));
  });
  $("#resetButton").on("click", reset);
  $("#randomButton").on("click", rand);

};

const togglePlay = (): void => {
  play = !play;
};

const setSpeed = () => {
  updateFrameRate = FRAME_RATE - document.getElementById("speedSlider").value;
}
// event listeners
$("#playPauseButton").on("click", togglePlay);
$("#speedSlider").on("change", setSpeed);
new p5(sketch);
