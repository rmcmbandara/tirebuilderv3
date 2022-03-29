//Band weight calculator Max

export const getBandWgtTol = (wgt) => {
  if (wgt > 10) {
    return wgt * 0.05
  } else {
    return wgt * 0.1
  }
}
