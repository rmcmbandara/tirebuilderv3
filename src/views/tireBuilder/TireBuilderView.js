import PropTypes from 'prop-types'
import React, { useState, useEffect, useRef } from 'react'
import { Badge, Button, Col, Dropdown, DropdownButton, Form, Row, Stack } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import SLTLDBConnection from '../../../src/apis/SLTLDBConnection'
import { notifyError, notifyErrorQk, notifySuccess } from 'src/utils/toastify'
import { getPidDetail } from '../pidUpdate/httpRequests/pidDetailforPid'
import { connect } from 'react-redux'

import { incrementCountAction } from '../../actions'
import { propTypes } from 'react-bootstrap/esm/Image'
import TireCodeInputComp from 'src/components/bulder/TireCodeInputComp'
import { getSpecDetailsList } from 'src/utils/specDetailCreator'
import SpecDisplayComp from 'src/components/bulder/SpecDisplayComp'
import TtlWgtDisplayComp from 'src/components/bulder/TtlWgtDisplayComp'
//Redux---------------------------------
import { setSpecBandWgt } from 'src/redux/band/bandActions'
import { useDispatch, useSelector } from 'react-redux'
import { setActBandWgt } from 'src/redux/band/bandActions'
import { setSettingWgt, setMinTol, setMaxTol } from 'src/redux/scalStability/stabilityActions'
import {
  updateTireCodeAvl,
  updateSpecAvl,
  updateSpecVerMach,
  updateEdc1StTire,
} from 'src/redux/dataAvl/dataAvlActions'
import { resetSpec } from 'src/redux/spec/specActions'
import { scaleReading } from '../../redux/scale/scaleActions'
import { toggleSrtPob } from '../../redux/srtpob/srtpobActions'
import { setTireCodeDetail } from 'src/redux/tireCodeDetail/tireCodeDetailsActions'
//---------------------------------------
import StabilitySetterComp from 'src/components/StabilitySetterComp'
import BandWgtScanComp from 'src/components/bulder/BandWgtScanComp'
import { getBandWgtTol } from 'src/utils/bandWgtTol'
const TireBuilderView = () => {
  //States and Refs-----------------------------
  //Inputs for tireCode and BandBarcode
  const [tireCodeInput, setTireCodeInput] = useState('') //TireCode input text state
  const [bandBarCodeInput, setBandBarCodeInput] = useState('') //TireCode input text state

  //Actual band weight to pass to ttlWgt Calculation componeint
  const [bandwgt_for_calculation, setBandwgt_for_calculation] = useState(0)
  //Get next SN
  const [nxtSN, setNxtSN] = useState(0)

  //Show and hide tirecode input and band input
  const [showBandInputComp, setShowBandInputComp] = useState(false)
  const [showTtlWgtComp, setShowTtlWgtComp] = useState(false)
  //Disable editing tirecode input and band input
  const [disableInputTireCode, setDisableInputTireCode] = useState(false)
  const [disableInputBand, setDisableInputBand] = useState(false)

  const [showed, setshowed] = useState(false) //Avoid double time showing toass of "Tire Code එකක් නොමත"
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
  const isSrt = useSelector((state) => state.isSrt)
  const tireCodeTxt = useSelector((state) => state.tireCodeText)
  const dataAvlReducer = useSelector((state) => state.dataAvlReducer)
  //Destructre redux states
  const { settingWgt, stable, toleranceWgt, ignoreSettingWgt, stableAbsolute } = stabilityDetail
  const { tcAvl, specVerMatch, edc1stTire, specAvl } = dataAvlReducer

  /////////////////////////////////////////////////////////////
  //Handlers and Methods-------------------------
  //This is passed to TireCodeInputComp.js
  const setTirecodeInputFun = (val) => {
    setTireCodeInput(val)
  }
  //This is passed to BandBarcodeInput.js
  const setBandBarCodeInputFun = (val) => {
    setBandBarCodeInput(val)
  }

  //Refresh Tire Code Input box
  const refreshTireCodeInput = () => {
    setTireCodeInput('')
    inputRef.current.focus()
  }

  const visibilityAndEditebilitySetter = () => {
    if (edc1stTire == 0 || edc1stTire == 2) {
      if (specVerMatch) {
        if (specAvl) {
          //Spec not avialble is not a possible case since cards can not be printed
          SLTLDBConnection.get(`sizebasic/gettcatbytirecode/${tireCodeInput.slice(0, 5)}`).then(
            (res) => {
              if (specVerMatch) {
                //SpecVersion is OK
                if (res.data && res.data.rows[0]) {
                  switch (res.data.rows[0].tcat) {
                    case 1: //SRTTire
                      setShowTtlWgtComp(true)
                      setShowBandInputComp(false)
                      setDisableInputTireCode(true)
                      dispatch(toggleSrtPob(true))
                      return
                    case 2: //POB Tire
                      setDisableInputTireCode(true)
                      setShowTtlWgtComp(false)
                      setShowBandInputComp(true)
                      dispatch(toggleSrtPob(false))
                      bandRef?.current.focus()
                      return
                    default:
                      return
                  }
                }
              } else {
                //Spec version is not OK
              }
            },
          )
        }
      } else {
        //Spec version does not match
        refreshTireCodeInput()
        notifyError('පැරණි කාඩ්පතකි. අලුත් කාඩ්පතක් ගන්න ')
        notifyError(specDetail?.data?.data?.spec?.specversion.toString())
      }
    } else if (edc1stTire == 1) {
      //EDC 1st Tire
      refreshTireCodeInput()
      notifyError('"EDC 1st Tire" ටයර් නිශ්පාධනය කල නොහැක')
    }
  }

  //-----------------------------------------------------------------------------
  //UseEffects-------------------------

  useEffect(() => {
    if (edc1stTire || specAvl) {
      visibilityAndEditebilitySetter()
    }
  }, [dataAvlReducer])

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
    }, 5000)
    return () => {
      clearInterval(timer)
    }
  }, [])

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

  //SpecDetail useEffect--------------------------------------------------
  //Check for spec Availability
  useEffect(() => {
    //specVersion Matching and Spec Availability send to the peraent-------------------------------
    if (specDetail?.data?.data) {
      dispatch(updateSpecAvl(true)) //Send SpecAvl info to perent base on Spec Avilability

      //Get the spec Version of the tireCode
      const specVerInput = tireCodeInput.substr(tireCodeInput.length - 3)
      const specVerDB = specDetail?.data?.data?.spec?.specversion.toString()
      const edc1stTirefrmDB = specDetail?.data?.data?.spec?.edc1sttire.toString()
      //Update EDC1stTire in Redux Store
      dispatch(updateEdc1StTire(edc1stTirefrmDB))
      //Send specVerMach info to perent base on Spec Avilability
      if (specVerInput === specVerDB) {
        dispatch(updateSpecVerMach(true))
      } else {
        dispatch(updateSpecVerMach(false))
      }
    } else {
      dispatch(updateSpecAvl(false)) //Send SpecAvl info to perent base on Spec Avilability
      dispatch(updateSpecVerMach(false)) //Send specVerMach info to perent base on Spec Avilability
    }
  }, [specDetail])

  //Band Input----------------------------------
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
        const bandWgt_numeric = parseFloat(bandWgtInput)
        if (bandWgt_numeric) {
          setBandwgt_for_calculation(bandWgt_numeric)
          const maxTolVal = getBandWgtTol(bandwgtSpec) + parseFloat(bandwgtSpec)
          const minTolVal = parseFloat(bandwgtSpec) - getBandWgtTol(bandwgtSpec)
          if (minTolVal > bandWgt_numeric) {
            //Reset band barcode input and band wgt for calculation
            setBandwgt_for_calculation(0)
            notifyError('අඩු බර බෑන්ඩ් එකක්')
            setBandBarCodeInput('')
            dispatch(setActBandWgt(0.0))
            bandRef.current.focus()
          } else if (maxTolVal < bandWgt_numeric) {
            notifyError('වැඩි බර බෑන්ඩ් එකක්')
            //Reset band barcode input and band wgt for calculation
            setBandwgt_for_calculation(0)
            setBandBarCodeInput('')
            dispatch(setActBandWgt(0.0))
            bandRef.current.focus()
          } else {
            //Band Wgt is in the range therfore Show totla wgt component
            setShowTtlWgtComp(true)
            setDisableInputTireCode(true)
            setDisableInputBand(true)
            dispatch(setActBandWgt(bandWgt_numeric))
          }
        }
      } else {
        setShowTtlWgtComp(false) //Hide ttlWgt componeint
        dispatch(setActBandWgt(0.0))
      }
    } else {
      dispatch(setActBandWgt(0.0))
    }
  }, [bandBarCodeInput])
  //TireCode Text
  //UseEffect for input tireCodeText
  useEffect(() => {
    if (tireCodeTxt?.data?.length === 8) {
      dispatch(setTireCodeDetail(tireCodeInput.substring(0, 5)))
    } else {
      dispatch(setTireCodeDetail('000')) //'000' is aBig not possible Number
      dispatch(resetSpec()) //Reset the spec
      setshowed(false) //Avoid double time showing toass of "Tire Code එකක් නොමත"
      dispatch(updateTireCodeAvl(false)) //Send tireCodeAvl Detail to Perent
      dispatch(setSettingWgt(0)) //Set scale stability setting weing to 0
      dispatch(setMinTol(0)) //Set minimum Tolerance Value 0
      dispatch(setMaxTol(0)) //Set Max Tolerance Value 0
      dispatch(toggleSrtPob(null)) //Set srt or pob tire to null
      dispatch(setSpecBandWgt(0.0)) //Band Spec Wgt -->0kg
      setBandBarCodeInputFun('') //Set band barcode to ""
      dispatch(updateEdc1StTire(null))
      setShowBandInputComp(false)
      dispatch(setSpecBandWgt(null))
    }
  }, [tireCodeTxt])

  const handleClickRefresh = () => {
    inputRef.current.focus()
    window.location.reload()
    setTireCodeInput('')
  }
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
          disableInputTireCode={disableInputTireCode}
          onBandBarcodeChange={setBandBarCodeInputFun}
        />
        <div className="m-3">
          <Button variant="warning" onClick={handleClickRefresh}>
            Refresh
          </Button>
        </div>
        {showBandInputComp && (
          <BandWgtScanComp
            bandRef={bandRef}
            bandBarCodeInput={bandBarCodeInput}
            onBandBarcodeChange={setBandBarCodeInputFun}
            disableInputBand={disableInputBand}
          />
        )}
      </Col>
      <Col sm={3}></Col>
      <Col sm={3}>
        {showTtlWgtComp && (
          <div className="mx-auto" style={{ marginTop: '50px', marginRight: 0 }}>
            <TtlWgtDisplayComp bandwgt_for_calculation={bandwgt_for_calculation} nxtSN={nxtSN} />
          </div>
        )}
        <div className="col text-center mt-5">
          <h1>
            <Badge bg="secondary">{nxtSN}</Badge>
          </h1>
        </div>
      </Col>
    </Row>
  )
}

export default TireBuilderView
