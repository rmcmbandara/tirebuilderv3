import React, { useEffect, useState } from 'react'
import { Button, Card, Nav } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import SLTLDBConnection from 'src/apis/SLTLDBConnection'
import { getSpecDetailsList } from 'src/utils/specDetailCreator'
import { setSettingWgt } from '../../redux/scalStability/stabilityActions'
import { getTtlWgtTol } from '../../utils/finalWgtTolleranceCreator'
import { setMaxTol, setMinTol } from '../../redux/scalStability/stabilityActions'
import { propTypes } from 'react-bootstrap/esm/Image'
import PropTypes from 'prop-types'
import { notifySuccess, notifySuccessQk } from 'src/utils/toastify'
const TtlWgtDisplayComp = ({ bandwgt_for_calculation, nxtSN }) => {
  //States--------------------------------------------
  const [specDetailObj, setSpecDetailObj] = useState({})
  const [bandWgtDisplay, setBandWgtDisplay] = useState('0')
  const [ttlWgt, setTtlWgt] = useState(0)
  const [scaleReading, setScaleReading] = useState(0)
  //Redux Selectors-------------------------------------
  const specDetail = useSelector((state) => state.specDetails)
  const tireCodeDetail = useSelector((state) => state.tireCodeDetails)
  const bandWgts = useSelector((state) => state.bandWgts)
  const dataAvl = useSelector((state) => state.dataAvlReducer)
  const { settingWgt, maxTol, minTol } = useSelector((state) => state.stabilityDetails)
  const { actBandWgt, specBandWgt } = useSelector((state) => state.bandWgts)
  const isSrt = useSelector((state) => state.isSrt)
  const scale = useSelector((state) => state.scaleData)
  const dispatch = useDispatch()
  const tireCodeTxt = useSelector((state) => state.tireCodeText)
  //Variable Decalrations
  const [wgtLst, setWgtLst] = useState([]) //Compound Detail List
  const specAvl = dataAvl?.specAvl
  //UseEffect for scale reading detection
  useEffect(() => {
    if (scale?.reading?.reading) {
      setScaleReading(scale?.reading?.reading?.wgtReading)
    }
  }, [scale])
  //SpecDetail useEffect
  //Check for spec Availability and if avl get the comp and wgts as an array
  useEffect(() => {
    if (specDetail) {
      setWgtLst(getSpecDetailsList())
    }
  }, [specDetail])

  //usee Effect for wgtLst change
  //Calculate total Wgt
  useEffect(() => {
    if (wgtLst) {
      if (!isSrt) {
        //For single layer POB Tire
        const lastElement = wgtLst[wgtLst.length - 1]
        if (lastElement) {
          const lastelementWgt = lastElement.wgt
          //Calculate the compound wgt with respect to bandWgt for calculation
          //Get Band Detail
          const bandwgtSpec = tireCodeDetail?.data?.data?.data[0]?.bandwgt
          //Difference of bands.
          const bandWgtDiff = parseFloat(bandwgtSpec) - parseFloat(bandwgt_for_calculation)
          const trWgtAdj = bandWgtDiff * 0.143

          //Ammend the last ekement

          wgtLst[wgtLst.length - 1].wgt = parseFloat(lastelementWgt) + parseFloat(trWgtAdj)
          console.log(wgtLst[wgtLst.length - 1].wgt)
        }
      }
      if (wgtLst?.length > 0 && wgtLst) {
        //Get the last element of the compound and adjust the weight if tire is pob tire.
        const sum_all =
          wgtLst &&
          wgtLst.map((item) => parseFloat(item.wgt)).reduce((prev, curr) => prev + curr, 0)
        const ttlWgtAdj = parseFloat(actBandWgt) + sum_all
        setTtlWgt(ttlWgtAdj)
      }
    }
  }, [wgtLst, bandwgt_for_calculation])

  //set setting Weight in stability redux
  useEffect(() => {
    //Set the setting weight for total weight
    if (ttlWgt && ttlWgt > 0) {
      //Get SettingWgt for SRT Tires----For POBs need band wgt adjestment
      dispatch(setSettingWgt(ttlWgt))
      const [minValue, maxValue] = getTtlWgtTol(parseFloat(ttlWgt))
      dispatch(setMaxTol(maxValue))
      dispatch(setMinTol(minValue))
    }
  }, [ttlWgt])
  //-------------------------------------------------------------------------------------
  //Functions and Hanlers
  const clickHandler = () => {
    const sn = nxtSN
    const tirecode = tireCodeTxt.data?.slice(0, 5)
    const tc = tirecode //for stock.stk table
    const pid = tireCodeDetail?.data?.data?.data[0]?.pid
    const sver = specDetail.data.data.spec.specversion
    const bvol = specDetail.data.data.spec.bvol
    const cvol = specDetail.data.data.spec.cvol
    const trvol = specDetail.data.data.spec.trvol
    const bonwgt = specDetail.data.data.spec.bonwgt
    const actwgt = scaleReading
    const bsg = specDetail.data.data.spec.bsg
    const csg = specDetail.data.data.spec.csg
    const trsg = specDetail.data.data.spec.trsg
    const bcode = specDetail.data.data.spec.bcode
    const ccode = specDetail.data.data.spec.ccode
    const trcode = specDetail.data.data.spec.trcode
    const specid = specDetail.data.data.spec.specid
    const stdbandwgt = bandWgts?.specBandWgt
    const actbandwgt = bandWgts?.actBandWgt
    const bandid = tireCodeDetail?.data?.data?.data[0]?.bandid
    //Insert builder table
    SLTLDBConnection.post(`builder/newgt`, {
      sn,
      tirecode,
      sver,
      bvol,
      cvol,
      trvol,
      bsg,
      csg,
      trsg,
      bonwgt,
      actwgt,
      bcode,
      ccode,
      trcode,
      specid,
      stdbandwgt,
      actbandwgt,
      bandid,
    })
      .then((res1) => {
        console.log('updated temp tires')
      })
      .catch((e) => {
        console.log(e)
      })
    //Update Stcok Table---------------------------------------------------------
    SLTLDBConnection.post(`stk/insert`, {
      sn,
      pid,
      tc,
    })
      .then((res1) => {
        console.log('updated temp tires')
      })
      .catch((e) => {
        console.log(e)
      })
    if (isSrt) {
      console.log(specDetail.data.data.spec.bvol)
    } else {
      notifySuccess('POB')
    }
  }
  return (
    <Card style={{ minWidth: '500px' }}>
      <Card.Header>
        <Nav variant="pills" defaultActiveKey="#first">
          <Nav.Item>
            <Nav.Link disabled style={{ fontSize: '35px' }}>
              {minTol.toFixed(2)}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link style={{ fontSize: '60px' }}>{settingWgt.toFixed(2)}</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link disabled style={{ fontSize: '35px' }}>
              {maxTol.toFixed(2)}
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Card.Header>
      <Card.Body>
        <div className="col text-center mt-5">
          <Button
            className="btn btn-default fs-1 mx-auto "
            style={{ minWidth: '300px', minHeight: '100px', marginRight: 0 }}
            onClick={clickHandler}
          >
            ENTER
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}
TtlWgtDisplayComp.propTypes = {
  bandwgt_for_calculation: propTypes.number,
  nxtSN: propTypes.number,
}
export default TtlWgtDisplayComp

/*


   <Card style={{ minWidth: '400px' }}>
      <Card.Header as="h5">Total Wgt</Card.Header>
      <Card.Body>
        <div className="col text-center">
          <Card.Title style={{ fontSize: '50px' }}>{settingWgt.toFixed(2)}</Card.Title>
        </div>
        <div className="col text-center mt-5">
          <Button
            className="btn btn-default fs-1 mx-auto "
            style={{ minWidth: '300px', minHeight: '100px', marginRight: 0 }}
            onClick={clickHandler}
          >
            ENTER
          </Button>
        </div>
      </Card.Body>
    </Card>
*/
