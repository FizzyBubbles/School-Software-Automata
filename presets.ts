import { Neighbourhood, RuleFunction, createRule, RuleSet } from "./game";
export const mooreNeighbourhood: Neighbourhood = [
  { x: -1, y: -1 },
  { x: -1, y: 0 },
  { x: -1, y: 1 },
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: 1, y: -1 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
];

//game of life
export const deathByLonelyness: RuleFunction = createRule({
  initialCellState: "alive",
  finalCellState: "dead",
  desiredStateCountBounds: { lower: 0, upper: 1 },
  requiredNeighbourState: "alive",
});
export const deathByCrowding: RuleFunction = createRule({
  initialCellState: "alive",
  finalCellState: "dead",
  desiredStateCountBounds: { lower: 4, upper: 8 },
  requiredNeighbourState: "alive",
});
export const birth: RuleFunction = createRule({
  initialCellState: "dead",
  finalCellState: "alive",
  desiredStateCountBounds: { lower: 3, upper: 3 },
  requiredNeighbourState: "alive",
});

// export const GOL: RuleSet = [deathByLonelyness, deathByCrowding, birth];

//brians brain
