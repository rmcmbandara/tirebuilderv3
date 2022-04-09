function getTtlWgtTol(ttlWgt) {
  let x
  if (parseFloat(ttlWgt) < 7) {
    //Less than 7
    x = getMaxMinTolTtlWgt(ttlWgt, 0.05, 2, 3)
  } else if (parseFloat(ttlWgt) < 15) {
    // //7-15
    x = getMaxMinTolTtlWgt(ttlWgt, 0.05, 2, 3)
  } else if (parseFloat(ttlWgt) < 30) {
    //Less than 30
    x = getMaxMinTolTtlWgt(ttlWgt, 0.05, 2, 3)
  } else if (parseFloat(ttlWgt) < 50) {
    //30 to 50
    x = getMaxMinTolTtlWgt(ttlWgt, 0.05, 2, 3)
  } else if (parseFloat(ttlWgt) < 70) {
    //Less than 70
    x = getMaxMinTolTtlWgt(ttlWgt, 0.05, 2, 3)
  } else if (parseFloat(ttlWgt) < 100) {
    //Less than 100
    x = getMaxMinTolTtlWgt(ttlWgt, 0.05, 2, 3)
  } else {
    //Bigger Tires
    x = getMaxMinTolTtlWgt(ttlWgt, 0.05, 2, 3)
  }
  const minValue = x.minValue
  const maxValue = x.maxValue
  return [minValue, maxValue]
}

const getMaxMinTolTtlWgt = (wgt, stepValue = 0.05, maxSteps = 1, minSteps = 0) => {
  //---------------------------------------------------------------
  const intPart = Number(Number(wgt).toString().split('.')[0])
  //----------------------------
  const decimalPartStr = Number(wgt).toString().split('.')[1]
  const deicalPartNum = Number('0.' + decimalPartStr)
  //---------------------------------
  var quo = Math.floor(deicalPartNum / stepValue)
  const maxValue = Number(intPart) + quo * stepValue + stepValue * maxSteps
  const minValue = Number(intPart) + quo * stepValue - stepValue * minSteps
  return { minValue, maxValue }
}
export { getTtlWgtTol }
