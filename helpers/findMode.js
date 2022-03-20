


const findMode = a => 
Object.values(
  a.reduce((count, e) => {
    if (!(e in count)) {
      count[e] = [0, e];
    }
    
    count[e][0]++;
    return count;
  }, {})
).reduce((a, v) => v[0] < a[0] ? a : v, [0, null])[1];

const findAverage = (arr) => {

   let total = 0;

   arr.forEach((item) => total += item);

   return total / arr.length;
};

module.exports = {
   findMode,
   findAverage
};