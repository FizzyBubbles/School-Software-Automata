const mooreNeighbourhood: Neighbourhood = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

//game of life
const deathByLonelyness: RuleFunction = createRule({
  initialCellState: 'alive',
  finalCellState: 'dead',
  desiredStateCountBounds: { x: 0, y: 1 },
  neighbourhood: mooreNeighbourhood,
  requiredNeighbourState: 'alive'
});
const deathByCrowding: RuleFunction = createRule({
  initialCellState: 'alive',
  finalCellState: 'dead',
  desiredStateCountBounds: { x: 4, y: 8 },
  neighbourhood: mooreNeighbourhood,
  requiredNeighbourState: 'dead'
});
const birth: RuleFunction = createRule({
  initialCellState: 'dead',
  finalCellState: 'alive',
  desiredStateCountBounds: { x: 3, y: 3 },
  neighbourhood: mooreNeighbourhood,
  requiredNeighbourState: 'alive'
});

//brians brain
