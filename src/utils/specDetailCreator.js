import SLTLDBConnection from 'src/apis/SLTLDBConnection'
import store from '../store'
export function getSpecDetailsList() {
  const specDetail = store.getState().specDetails
  //Check for Spe availability
  //specVersion Matching and Spec Availability send to the peraent
  if (specDetail?.data?.data) {
    //Return Value
    var lst = []
    const { bcomp, bvol, bsg, ccomp, cvol, csg, trcomp, trvol, trsg, bonwgt } =
      specDetail?.data?.data?.spec
    if (parseFloat(bvol) > 0) {
      var comp = {}
      const bwgt = parseFloat(bvol) * parseFloat(bsg)
      var comp = {}
      comp.comp = bcomp
      comp.wgt = bwgt.toFixed(2)
      lst.push(comp)
    }
    if (parseFloat(bonwgt) > 0) {
      var comp = {}
      comp.comp = parseFloat(cvol) > 0 ? `${bcomp} + ${ccomp}` : `${bcomp} + ${trcomp}`
      comp.wgt = parseFloat(bonwgt).toFixed(2)
      lst.push(comp)
    }
    if (parseFloat(cvol) > 0) {
      var comp = {}
      comp.comp = ccomp

      const cwgt = parseFloat(cvol) * parseFloat(csg)
      comp.wgt = parseFloat(parseFloat(cwgt)).toFixed(2)
      lst.push(comp)
    }
    if (parseFloat(trvol) > 0) {
      var comp = {}
      comp.comp = trcomp

      const trwgt = parseFloat(trvol) * parseFloat(trsg)
      comp.wgt = parseFloat(trwgt).toFixed(2)
      lst.push(comp)
    }

    return lst
  }
}
