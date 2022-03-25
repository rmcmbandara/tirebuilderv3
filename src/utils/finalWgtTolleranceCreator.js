function getTtlWgtTol(ttlWgt) {
  let minValue
  let maxValue

  if (parseFloat(ttlWgt) < 10) {
    //Less than 10
    console.log('less than 10 tire')
    minValue = parseFloat(ttlWgt) * 0.97
    maxValue = parseFloat(ttlWgt) * 1.03
  } else if (parseFloat(ttlWgt) < 30) {
    //Less than 30
    console.log('10 to 30 Tire')
    minValue = parseFloat(ttlWgt) * 0.97
    maxValue = parseFloat(ttlWgt) * 1.03
  } else if (parseFloat(ttlWgt) < 50) {
    //Less than 50
    minValue = parseFloat(ttlWgt) * 0.96
    maxValue = parseFloat(ttlWgt) * 1.03
    console.log('30 to 50 Tire')
  } else if (parseFloat(ttlWgt) < 70) {
    //Less than 70
    minValue = parseFloat(ttlWgt) * 0.95
    maxValue = parseFloat(ttlWgt) * 1.03
    console.log('50 to 70 Tire')
  } else if (parseFloat(ttlWgt) < 100) {
    //Less than 100
    console.log('70 to 100 Tire')
    minValue = parseFloat(ttlWgt) * 0.94
    maxValue = parseFloat(ttlWgt) * 1.03
  } else {
    //Bigger Tires
    minValue = parseFloat(ttlWgt) * 0.96
    maxValue = parseFloat(ttlWgt) * 1.01
    console.log('Latger Tire')
  }
  return [minValue, maxValue]
}
export { getTtlWgtTol }
