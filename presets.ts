const mooreNeighbourhood: Neighbourhood = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

//game of life
const deathByLonelyness: RuleFunction = createRule({
  initialCellState: 'alive',
  finalCellState: 'dead',
  desiredStateCountBounds: { lower: 0, upper: 1 },
  neighbourhood: mooreNeighbourhood,
  requiredNeighbourState: 'alive'
});
const deathByCrowding: RuleFunction = createRule({
  initialCellState: 'alive',
  finalCellState: 'dead',
  desiredStateCountBounds: { lower: 4, upper: 8 },
  neighbourhood: mooreNeighbourhood,
  requiredNeighbourState: 'dead'
});
const birth: RuleFunction = createRule({
  initialCellState: 'dead',
  finalCellState: 'alive',
  desiredStateCountBounds: { lower: 3, upper: 3 },
  neighbourhood: mooreNeighbourhood,
  requiredNeighbourState: 'alive'
});

const GOL: RuleSet = [deathByLonelyness, deathByCrowding, birth];

//brians brain
