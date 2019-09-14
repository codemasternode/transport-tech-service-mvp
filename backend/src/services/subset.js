numbers = [12, 1, 82, 1, 4, 44, 2, 14, 15, 16];

const vehicles = []

var result = createSubsets(numbers, 33);

console.log("Result", JSON.stringify(result));

function createSubsets(numbers, target) {
  // filter out all items larger than target
  numbers = numbers.filter(function(value) {
    return value <= target;
  });

  // sort from largest to smallest
  numbers.sort(function(a, b) {
    return b - a;
  });

  // array with all the subsets
  var result = [];

  while (numbers.length > 0) {
    var i;
    var sum = 0;
    var addedIndices = [];

    // go from the largest to the smallest number and
    // add as many of them as long as the sum isn't above target
    for (i = 0; i < numbers.length; i++) {
      if (sum + numbers[i] <= target) {
        sum += numbers[i];
        addedIndices.push(i);
      }
    }

    // remove the items we summed up from the numbers array, and store the items to result
    // since we're going to splice the numbers array several times we start with the largest index
    // and go to the smallest to not affect index position with splice.
    var subset = [];
    for (i = addedIndices.length - 1; i >= 0; i--) {
      subset.unshift(numbers[addedIndices[i]]);
      numbers.splice(addedIndices[i], 1);
    }
    result.push(subset);
  }

  return result;
}
