export const findVariance = (arr: number[] = []) => {
  if (!arr.length) {
    return 0;
  }

  // calculate mean
  const sum = arr.reduce((acc, val) => acc + val);
  const mean = sum / arr.length;

  // calculate variance
  // let variance = 0;
  // arr.forEach((num) => {
  //   variance += (num - mean) * (num - mean);
  // });
  // variance = variance / arr.length;

  const sumAllSquareDiffs = arr.reduce((acc, curr) => {
    // sum of all square diffs
    const diff = curr - mean;
    return diff * diff;
  }, 0);

  const variance = sumAllSquareDiffs / arr.length;

  return variance;
};
