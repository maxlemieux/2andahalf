const SeedRandom = require('seedrandom');

let seedKey = 1270;

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
  const randomVal = randomArray[Math.floor(getSeed() * randomArray.length)];
  // console.log(randomVal);
  // if (randomVal === undefined) {
  //   console.log(randomArray)
  // }
  return randomVal;
};

module.exports = {
  getSeed,
  seedrandomRange,
};
