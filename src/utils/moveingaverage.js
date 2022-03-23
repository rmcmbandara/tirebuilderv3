var _ = require('lodash')
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 10]

//Add all the numbers in numbers array
function sum(numbers) {
  return _.reduce(numbers, (a, b) => a + b, 0)
}

function average(numbers) {
  return sum(numbers) / (numbers.length || 1)
}

function make_window(before, after) {
  return function (_number, index, array) {
    const start = Math.max(0, index - before)
    const end = Math.min(array.length, index + after + 1)
    return _.slice(array, start, end)
  }
}

function moving_average(before, after, numbers) {
  return _.chain(numbers).map(make_window(before, after)).map(average).value()
}

const rng = (x, y, arr) => {
  const movav = moving_average(x, y, arr)

  const max = Math.max.apply(Math, movav)
  const min = Math.min.apply(Math, movav)
  const range = max - min
  return average(movav)
}

export { rng }
