import React, { useEffect, useState } from 'react'
import { Button, Card } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import SLTLDBConnection from 'src/apis/SLTLDBConnection'
import { getSpecDetailsList } from 'src/utils/specDetailCreator'
import { setSettingWgt } from '../../redux/scalStability/stabilityActions'
import { getTtlWgtTol } from '../../utils/finalWgtTolleranceCreator'
const TtlWgtDisplayComp = () => {
  //States--------------------------------------------
  const [specDetailObj, setSpecDetailObj] = useState({})
  const [bandWgtDisplay, setBandWgtDisplay] = useState('0')
  const [ttlWgt, setTtlWgt] = useState(0)
  //Redux Selectors-------------------------------------
  const specDetail = useSelector((state) => state.specDetails)
  const tireCodeDetail = useSelector((state) => state.tireCodeDetails)
  const dataAvl = useSelector((state) => state.dataAvlReducer)
  const { settingWgt } = useSelector((state) => state.stabilityDetails)
  const dispatch = useDispatch()
  //Get the Band Details
  const bandwgt = tireCodeDetail?.data?.data?.data[0]?.bandwgt

  //Variable Decalrations
  const [wgtLst, setWgtLst] = useState([]) //Compound Detail List

  const specAvl = dataAvl?.specAvl
  //SpecDetail useEffect
  //Check for spec Availability and if avl get the comp and wgts as an array
  useEffect(() => {
    setWgtLst(getSpecDetailsList())
  }, [specDetail])

  //usee Effect for wgtLst change
  //Calculate total Wgt
  useEffect(() => {
    if (wgtLst?.length > 0 && wgtLst) {
      const sumall =
        wgtLst && wgtLst.map((item) => parseFloat(item.wgt)).reduce((prev, curr) => prev + curr, 0)
      const x = parseFloat(bandwgt) + sumall
      setTtlWgt(x)
    }
  }, [wgtLst])

  //set setting Weight in stability redux
  useEffect(() => {
    //Set the setting weight for total weight
    if (ttlWgt && ttlWgt > 0) {
      dispatch(setSettingWgt(ttlWgt))
    }
  }, [ttlWgt])

  //Click Handler
  const [mvavArr, setMvavArr] = useState([])
  const [count, setCount] = useState(0)
  const clickHandler = () => {
    const [minValue, maxValue] = getTtlWgtTol(101)
    console.log('min Val ' + minValue)
    console.log('max val ' + maxValue)
  }

  return (
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
  )
}

export default TtlWgtDisplayComp
