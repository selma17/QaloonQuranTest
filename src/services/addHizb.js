const fs = require("fs");
const path = require("path");

const inputPath = path.join(__dirname, "../data/qaloonQuran.json");
const outputPath = path.join(__dirname, "../data/qaloonQuran_with_hizb.json");

const data = JSON.parse(fs.readFileSync(inputPath, "utf8"));

const hizbStart = [
   1,   75,  149, 221,  293, 365,  438, 510,  584, 657,
  729, 803,  875, 947, 1021,1093, 1167,1239, 1313,1385,
  1459,1531, 1605,1677, 1751,1823, 1897,1969, 2043,2115,
  2189,2261, 2335,2407, 2481,2553, 2627,2699, 2773,2845,
  2919,2991, 3065,3137, 3211,3283, 3357,3429, 3503,3575,
  3649,3721, 3795,3867, 3941,4013, 4087,4159, 4233,4305
];

function getHizb(globalAyaIndex) {
  for (let i = hizbStart.length - 1; i >= 0; i--) {
    if (globalAyaIndex >= hizbStart[i]) {
      return i + 1;
    }
  }
  return 1;
}

const updated = data.map((item, index) => ({
  ...item,
  hizb: getHizb(index + 1)
}));

fs.writeFileSync(outputPath, JSON.stringify(updated, null, 2));

