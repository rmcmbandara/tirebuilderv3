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
import { isNumeric } from 'src/utils/isNumeric'
import { getBandWgtTol } from 'src/utils/bandWgtTol'
const TireBuilderView = () => {
  //States and Refs-----------------------------
  //these 3 states for specAvl,tireCodeAvl and SpecVerMatch
  const [specAvl, setSpecAvl] = useState(false)
  const [tireCodeAvl, setTireCodeAvl] = useState(false)
  const [specVerMatch, setSpecVerMatch] = useState(false)
  const [scaleReadingx, setScaleReadingx] = useState(0)

  //Inputs for tireCode and BandBarcode
  const [tireCodeInput, setTireCodeInput] = useState('1177511') //TireCode input text state
  const [bandBarCodeInput, setBandBarCodeInput] = useState('') //TireCode input text state

  //Band wgt tollerence max and min
  const [minBandTol, setMinBandTol] = useState(0)
  const [maxBandTol, setMaxBandTol] = useState(0)

  //Get next SN
  const [nxtSN, setNxtSN] = useState(0)

  //Show and hide tirecode input and band input
  const [showBandInputComp, setShowBandInputComp] = useState(false)
  const [showTtlWgtComp, setShowTtlWgtComp] = useState(false)
  //Disable editing tirecode input and band input
  const [stblTimeOutSetting, setStblTimeOutSetting] = useState(1000)
  const [disableInputTireCode, setDisableInputTireCode] = useState(false)
  //Refs for TireCode and BandBarcode
  const inputRef = useRef()
  const bandRef = useRef()
  ///////////////////////////////

  //Redux-------------------------------------

  const dispatch = useDispatch()
  const tireDetail = useSelector((state) => state.tireDetails)
  const specDetail = useSelector((state) => state.specDetails)
  const stabilityDetail = useSelector((state) => state.stabilityDetails)
  const tireCodeDetail = useSelector((state) => state.tireCodeDetails)
  //Destructre stability Detail
  const { settingWgt, stable, toleranceWgt, ignoreSettingWgt, stableAbsolute } = stabilityDetail

  /////////////////////////////////////////////////////////////
  //Handlers and Methods-------------------------
  const setTirecodeInputFun = (val) => {
    setTireCodeInput(val)
  }
  const setBandBarCodeInputFun = (val) => {
    setBandBarCodeInput(val)
  }
  //UseEffects-------------------------
  //Focus input ref whenever page is loaded and refreshed
  useEffect(() => {
    inputRef?.current.focus()
  }, [])

  //Timer for get Next SN(Already added next sn )
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

  //Band Input
  useEffect(() => {
    if (bandBarCodeInput.length > 0) {
      //Get the first and last letters
      let firstLetter = bandBarCodeInput.charAt(0)
      let lastLetter = bandBarCodeInput.charAt(bandBarCodeInput.length - 1)
      //chck for S and L first and last charactors
      if ((firstLetter == 's' || firstLetter == 'S') && (lastLetter == 'l' || lastLetter == 'L')) {
        //Get Band Detail
        const bandwgtSpec = tireCodeDetail?.data?.data?.data[0]?.bandwgt
        //Get enterd band wgt
        const bandWgtInput = bandBarCodeInput.slice(1, -1)
        const bandWgtConve = parseFloat(bandWgtInput)
        const maxTolVal = getBandWgtTol(bandwgtSpec) + parseFloat(bandwgtSpec)
        const minTolVal = parseFloat(bandwgtSpec) - getBandWgtTol(bandwgtSpec)

        if (minTolVal > bandWgtConve) {
          notifyError('අඩු බර බෑන්ඩ් එකක්')
          setBandBarCodeInput('')
          bandRef.current.focus()
        } else if (maxTolVal < bandWgtConve) {
          notifyError('වැඩි බර බෑන්ඩ් එකක්')
          setBandBarCodeInput('')
          bandRef.current.focus()
        } else {
          //Band in correct range
          //Calculate the total wgt accordingly and show total wgt
        }
      }
    }
  }, [bandBarCodeInput])

  //Scale Reading------------------------------------------------------------------
  const scale = useSelector((state) => state.scaleData)
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
  //------------------------------------------------------------------
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
          if (res.data && res.data.rows[0]) {
            switch (res.data.rows[0].tcat) {
              case 1:
                setShowTtlWgtComp(true)
                setShowBandInputComp(false)
                setDisableInputTireCode(true)
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
  //Get the band wgt min and max tollerences
  useEffect(() => {
    if (tireCodeDetail) {
      const bandwgtSpec = tireCodeDetail?.data?.data?.data[0]?.bandwgt
    }
  }, [tireCodeDetail])

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
            disableInputTireCode={disableInputTireCode}
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
