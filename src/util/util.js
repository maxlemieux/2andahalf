const SeedRandom = require('seedrandom');

let seedKey = 1250;
const getSeed = () => {
  const seed = new SeedRandom(seedKey);
  const thisSeed = seed(seedKey);
  seedKey += 1;
  return thisSeed;
};

module.exports = {
  getSeed,
};
