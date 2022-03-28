import PropTypes from 'prop-types'
import React, { useState, useEffect, useRef } from 'react'
import { Badge, Button, Col, Dropdown, DropdownButton, Form, Row, Stack } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import SLTLDBConnection from '../../../src/apis/SLTLDBConnection'
import { notifyError } from 'src/utils/toastify'
import { getPidDetail } from '../pidUpdate/httpRequests/pidDetailforPid'
import { connect } from 'react-redux'

import { incrementCountAction } from '../../actions'
import { propTypes } from 'react-bootstrap/esm/Image'
import TireCodeInputComp from 'src/components/bulder/TireCodeInputComp'
import { getSpecDetailsList } from 'src/utils/specDetailCreator'
import SpecDisplayComp from 'src/components/bulder/SpecDisplayComp'
import TtlWgtDisplayComp from 'src/components/bulder/TtlWgtDisplayComp'
//Redux---------------------------------
import { useDispatch, useSelector } from 'react-redux'
import { updateSN } from '../../redux/builderFinalData/buildFinalActions'
import { scaleReading } from '../../redux/scale/scaleActions'
import StabilitySetterComp from 'src/components/StabilitySetterComp'
import { rng } from 'src/utils/moveingaverage'
import { BubbleController } from 'chart.js'
import BandWgtScanComp from 'src/components/bulder/BandWgtScanComp'
const TireBuilderView = () => {
  //States and Refs-----------------------------
  //these 3 states for specAvl,tireCodeAvl and SpecVerMatch
  const [specAvl, setSpecAvl] = useState(false)
  const [tireCodeAvl, setTireCodeAvl] = useState(false)
  const [specVerMatch, setSpecVerMatch] = useState(false)
  const [showBandInputComp, setShowBandInputComp] = useState(false)
  const [showTtlWgtComp, setShowTtlWgtComp] = useState(false)

  const [stblTimeOutSetting, setStblTimeOutSetting] = useState(1000)
  const [scaleReadingx, setScaleReadingx] = useState(0)

  const [tireCodeInput, setTireCodeInput] = useState('1177511') //TireCode input text state
  const [bandBarCodeInput, setBandBarCodeInput] = useState('') //TireCode input text state
  const [name, setName] = useState('foo')
  const [tcat, setTcat] = useState()
  //Get next SN
  const [nxtSN, setNxtSN] = useState(0)

  const inputRef = useRef()
  const bandRef = useRef()

  //Handlers and Methods-------------------------
  const setTirecodeInputFun = (val) => {
    setTireCodeInput(val)
  }
  const setBandBarCodeInputFun = (val) => {
    setBandBarCodeInput(val)
  }
  //Handle band input show
  useEffect(() => {}, [tireCodeInput])

  //UseEffects-------------------------
  useEffect(() => {
    inputRef?.current.focus()
  }, [])

  useEffect(() => {
    //Initialize
    const timer = setInterval(async () => {
      SLTLDBConnection.get(`builder/nextsn`).then((res) => {
        setNxtSN(res.data)
      })
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [])
  //Scale Reading -------------------
  const scale = useSelector((state) => state.scaleData)
  const dispatch = useDispatch()
  var { reading } = scale
  //Fetch from localhost:4000/sc  and store in redux store with timer
  useEffect(() => {
    //Initialize
    const sto = { reading: 0, time: Date.now() }
    localStorage.setItem('cr', JSON.stringify(sto))
    const timer = setInterval(async () => {
      //codes are executed every 200ms
      dispatch(scaleReading())
    }, 200)
    return () => {
      clearInterval(timer)
    }
  }, [])

  //UseEffect to show or hide band barcode input text
  /*
  When tirecode length is 8
  if srt tire show totoal wgt
  if band tire 
  first show band scan text. if it is scanned show total wgt  */
  useEffect(() => {
    if (tireCodeInput.length == 8) {
      SLTLDBConnection.get(`sizebasic/gettcatbytirecode/${tireCodeInput.slice(0, 5)}`).then(
        (res) => {
          if (res.data) {
            switch (res.data.rows[0].tcat) {
              case 1:
                setShowTtlWgtComp(true)
                setShowBandInputComp(false)
                return
              case 2:
                setShowTtlWgtComp(false)
                setShowBandInputComp(true)
                bandRef?.current.focus()
                return
              default:
                setShowTtlWgtComp(false)
                setShowBandInputComp(false)
                return
            }
          }
        },
      )
    }
  }, [tireCodeInput])

  ///////////////////////////////
  var mvavArr = []

  //Redux-------------------------------------
  const tireDetail = useSelector((state) => state.tireDetails)
  const specDetail = useSelector((state) => state.specDetails)
  const stabilityDetail = useSelector((state) => state.stabilityDetails)

  //Destructre stability Detail
  const { settingWgt, stable, toleranceWgt, ignoreSettingWgt, stableAbsolute } = stabilityDetail

  useEffect(() => {
    if (scale.reading !== undefined) {
      setScaleReadingx(scale?.reading?.reading?.wgtReading)
      //-------------------------------
      //Time series calculation for IH
    }
    //******Important********    DELETE
    //  {Key:cr ,value:cr	{"reading":" 3.06","time":1606103572272}}
  }, [scale])
  /////////////////////////////////////////////////////////////
  return (
    <Row
      style={{
        backgroundColor: !stableAbsolute && 'lightgray',
      }}
    >
      <Col sm={3}>
        <div style={{ marginTop: '50px', marginRight: 0 }}>
          <SpecDisplayComp />
        </div>
        <TireCodeInputComp
          inputRef={inputRef}
          tireCodeInput={tireCodeInput}
          onTireCodeChange={setTirecodeInputFun}
        />
        <div className="m-3"></div>
        {showBandInputComp && (
          <BandWgtScanComp
            bandRef={bandRef}
            bandBarCodeInput={bandBarCodeInput}
            onBandBarcodeChange={setBandBarCodeInputFun}
            name={bandBarCodeInput}
            onNameChange={setBandBarCodeInput}
          />
        )}
      </Col>
      <Col sm={3}></Col>
      <Col sm={3}>
        {showTtlWgtComp && (
          <div className="mx-auto" style={{ marginTop: '50px', marginRight: 0 }}>
            <TtlWgtDisplayComp />
          </div>
        )}
        <div className="col text-center mt-5">
          <h1>
            <Badge bg="secondary">{nxtSN}</Badge>
          </h1>
        </div>
      </Col>
      <StabilitySetterComp />
    </Row>
  )
}

export default TireBuilderView
