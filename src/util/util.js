const SeedRandom = require('seedrandom');

let seedKey = 1268;
const getSeed = () => {
  const seed = new SeedRandom(seedKey);
  const thisSeed = seed(seedKey);
  seedKey += 1;
  return thisSeed;
};

const seedrandomRange = (start, end) => {
  const randomArray = [];
  for (let i = start; i <= end; i += 1) {
    randomArray.push(i);
  }
  return randomArray[Math.floor(getSeed() * randomArray.length)];
};

module.exports = {
  getSeed,
  seedrandomRange,
};
