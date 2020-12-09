/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canPartition = function (nums,k) {
  const eachTotal = nums.reduce((t, e) => t + e, 0) / k
  const dp = {
    0: true
  }
  for (let num of nums) {
    for (let key in dp) {
      dp[num + (key - 0)] = true
    }
  }
  return !!dp[eachTotal]
};

console.log(
  canPartition(
    [4, 3, 2, 3, 5, 2, 1],
    4
  )
)