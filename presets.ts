let mooreNeighbourhood = new Neighbourhood([[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]);

//game of life
let GOL;
let deathByLonelyness = new Rule(true, 0, 1, true, false, mooreNeighbourhood);
let deathByCrowding = new Rule(true, 4, 8, true, false, mooreNeighbourhood);
let birth = new Rule(false, 3, 3, true, true, mooreNeighbourhood);


//brians brain
let BB;
let BBirth = ['dead']
