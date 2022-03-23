function getTtlWgtTol(ttlWgt) {
  let minValue
  let maxValue

  if (parseInt(ttlWgt) < 10) {
    //Less than 10
    console.log('less than 10 tire')
    minValue = parseInt(ttlWgt) * 0.97
    maxValue = parseInt(ttlWgt) * 1.03
    return [minValue, maxValue]
  } else if (parseInt(ttlWgt) < 30) {
    //Less than 30
    console.log('10 to 30 Tire')
    minValue = parseInt(ttlWgt) * 0.97
    maxValue = parseInt(ttlWgt) * 1.03
    return [minValue, maxValue]
  } else if (parseInt(ttlWgt) < 50) {
    minValue = parseInt(ttlWgt) * 0.96
    maxValue = parseInt(ttlWgt) * 1.03
    console.log('30 to 50 Tire')
    return [minValue, maxValue]
  } else if (parseInt(ttlWgt) < 70) {
    minValue = parseInt(ttlWgt) * 0.95
    maxValue = parseInt(ttlWgt) * 1.03
    console.log('50 to 70 Tire')
    return [minValue, maxValue]
  } else if (parseInt(ttlWgt) < 100) {
    console.log('70 to 100 Tire')
    minValue = parseInt(ttlWgt) * 0.94
    maxValue = parseInt(ttlWgt) * 1.03
    return [minValue, maxValue]
  } else {
    minValue = parseInt(ttlWgt) * 0.96
    maxValue = parseInt(ttlWgt) * 1.01
    console.log('Latger Tire')
    return [minValue, maxValue]
  }
}
export { getTtlWgtTol }
