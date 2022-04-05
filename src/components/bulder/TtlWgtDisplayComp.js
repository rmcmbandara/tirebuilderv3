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
const TtlWgtDisplayComp = ({ bandwgt_for_calculation }) => {
  //States--------------------------------------------
  const [specDetailObj, setSpecDetailObj] = useState({})
  const [bandWgtDisplay, setBandWgtDisplay] = useState('0')
  const [ttlWgt, setTtlWgt] = useState(0)
  //Redux Selectors-------------------------------------
  const specDetail = useSelector((state) => state.specDetails)
  const tireCodeDetail = useSelector((state) => state.tireCodeDetails)
  const dataAvl = useSelector((state) => state.dataAvlReducer)
  const { settingWgt, maxTol, minTol } = useSelector((state) => state.stabilityDetails)
  const { actBandWgt, specBandWgt } = useSelector((state) => state.bandWgts)
  const isSrt = useSelector((state) => state.isSrt)
  const dispatch = useDispatch()
  //Get the Band Details

  //Variable Decalrations
  const [wgtLst, setWgtLst] = useState([]) //Compound Detail List

  const specAvl = dataAvl?.specAvl
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
          const trWgtAdj = bandWgtDiff * 1.143

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

  //Click Handler
  const [mvavArr, setMvavArr] = useState([])
  const [count, setCount] = useState(0)
  const clickHandler = () => {
    const [minValue, maxValue] = getTtlWgtTol(101)
  }

  return (
    <Card style={{ minWidth: '500px' }}>
      <Card.Header>
        {bandwgt_for_calculation}
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
