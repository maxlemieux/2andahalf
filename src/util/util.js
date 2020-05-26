const SeedRandom = require('seedrandom');

let seedKey = 1309;

const getSeed = () => {
  const seed = new SeedRandom(seedKey);
  const thisSeed = seed(seedKey);
  seedKey += 1;
  return thisSeed;
};

const seedrandomRange = (val1, val2) => {
  const randomArray = [];
  const sortedVals = [val1, val2].sort(function (a, b) {return a - b });
  for (let i = sortedVals[0]; i <= sortedVals[1]; i += 1) {
    randomArray.push(i);
  }
  const randomVal = randomArray[Math.floor(getSeed() * randomArray.length)];
  return randomVal;
};

module.exports = {
  getSeed,
  seedrandomRange,
};
