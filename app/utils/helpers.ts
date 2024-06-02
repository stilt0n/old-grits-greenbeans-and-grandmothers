/**
 * Partitions an array on a condition
 * Like filter but results in two arrays for true and false
 * returns [truePartition, falsePartition];
 */
export const partition = <T>(arr: T[], predicate: (el: T) => boolean) => {
  const truePartition = [];
  const falsePartition = [];
  for (const el of arr) {
    if (predicate(el)) {
      truePartition.push(el);
    } else {
      falsePartition.push(el);
    }
  }
  return [truePartition, falsePartition];
};
