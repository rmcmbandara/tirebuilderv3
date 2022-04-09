function getTtlWgtTol(ttlWgt) {
  let minValue
  let maxValue

  if (parseFloat(ttlWgt) < 10) {
    //Less than 10
    minValue = parseFloat(ttlWgt) * 0.99
    maxValue = parseFloat(ttlWgt) * 1.01
  } else if (parseFloat(ttlWgt) < 30) {
    //Less than 30
    minValue = parseFloat(ttlWgt) * 0.97
    maxValue = parseFloat(ttlWgt) * 1.03
  } else if (parseFloat(ttlWgt) < 50) {
    //Less than 50
    minValue = parseFloat(ttlWgt) * 0.99
    maxValue = parseFloat(ttlWgt) * 1.01
  } else if (parseFloat(ttlWgt) < 70) {
    //Less than 70
    minValue = parseFloat(ttlWgt) * 0.99
    maxValue = parseFloat(ttlWgt) * 1.01
  } else if (parseFloat(ttlWgt) < 100) {
    //Less than 100
    minValue = parseFloat(ttlWgt) * 0.94
    maxValue = parseFloat(ttlWgt) * 1.03
  } else {
    //Bigger Tires
    minValue = parseFloat(ttlWgt) * 0.96
    maxValue = parseFloat(ttlWgt) * 1.01
  }
  return [minValue, maxValue]
}
export { getTtlWgtTol }
