import PropTypes from 'prop-types'
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { Badge, Button, Col, Form, Modal, Row } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import SLTLDBConnection from '../../../src/apis/SLTLDBConnection'
import { notifyError, notifyErrorQk, notifySuccess, notifySuccessQk } from 'src/utils/toastify'
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
import { setisChantedNxtSnTrue } from 'src/redux/nxtSn/nxtSnActions'
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
import CountDownTmer from 'src/components/bulder/CountDownTmer'

import { PRINT_X, PRINT_Y } from 'src/utils/constants'
import printerHost from 'src/apis/printerHost'
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
  //nextSN display model states
  const [showSNChange, setShowSNChange] = useState(false)
  const [changedNxtSN, setChangedNxtSN] = useState()

  //PressNo enter model States
  const [showPressEnter, setShowPressEnter] = useState(false)
  const [pressNo, setPressNo] = useState('')

  //SN available in stock Table
  const [isSnAvlinStockTbl, setisSnAvlinStockTbl] = useState(false)

  //Refs for TireCode and BandBarcode
  const inputRef = useRef()
  const bandRef = useRef()

  //Scale
  const [scaleReadingBand, setScaleReadingBand] = useState(0)
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
  const isNxtSnChangeSetTrue = useSelector((state) => state.nxtSnChangeSetTrueReducer)
  //Destructre redux states
  const { settingWgt, stable, toleranceWgt, ignoreSettingWgt, stableAbsolute } = stabilityDetail
  const { tcAvl, specVerMatch, edc1stTire, specAvl } = dataAvlReducer

  var balancetoMfgQty
  /////////////////////////////////////////////////////////////
  //Handlers and Methods-------------------------
  //Functions to show and hide next SN model
  //Get Current Time and date for databse
  const [dateTimedb, setDateTimedb] = useState('')
  const getDateTimedb = () => {
    //Get Current Date
    var date = new Date().getDate()
    //Get Current Month
    var month = new Date().getMonth() + 1
    //Get Current Year
    var year = new Date().getFullYear()
    //Get Current Time Hours
    var hours = new Date().getHours()
    //Get Current Time Minutes
    var min = new Date().getMinutes()
    //Get Current Time Seconds
    var sec = new Date().getSeconds()
    var finalObject = date + '/' + month + '/' + year + ' ' + hours + ':' + min + ':' + sec
    setDateTimedb(finalObject)
  }
  const handleChangeSNButtonModel = (e) => {
    setShowSNChange(false)
    dispatch(setisChantedNxtSnTrue(true))
    SLTLDBConnection.get(`stk/getsnavl/${changedNxtSN}`)
      .then((res) => {
        if (res.data.data.rowCount != 0) {
          setShowSNChange(true)
          dispatch(setisChantedNxtSnTrue(false))
          notifyError('මෙම SNය ටයර් ස්ටෝරුවේ ඇත')
        } else {
          setShowSNChange(false)
          dispatch(setisChantedNxtSnTrue(true))
          setisSnAvlinStockTbl(false)
        }
      })
      .catch((e) => console.log(e.message))
  }
  const handleCloseSNChange = () => setShowSNChange(false)
  const handleShowSNChange = () => {
    setShowSNChange(true)
    setChangedNxtSN(nxtSN)
  }
  //Functions to show and hide Press Enter Modle
  const handleClosePressEnter = () => setShowPressEnter(false)
  const handleShowPressEnter = () => setShowPressEnter(true)

  const showPressEnterRemotely = (val) => {
    setShowPressEnter(val)
  }
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

  //Handle changeSN handler
  const handleNxtSNChange = (e) => {
    setChangedNxtSN(e.target.value)
  }

  //handleNxtSNChange handler
  const handlePressNoEnter = (e) => {
    setPressNo(e.target.value)
  }

  const visibilityAndEditebilitySetter = () => {
    var avlinStkNos
    var orderSummeryNos
    var pidAvlInOrderSummeryTbl = false
    //Get PID
    const pid = tireCodeDetail.data?.data.data[0].pid
    //Get avl tires in stock table
    SLTLDBConnection.get(`stk/getavltires/${pid}`).then((res) => {
      avlinStkNos = res.data.data.rows[0].count
      //Get order summery detail
      SLTLDBConnection.get(`/ordersummery/ordersummeryofpid/${pid}`).then((res) => {
        orderSummeryNos = res.data[0]?.nos
        if (res.data?.length > 0) {
          pidAvlInOrderSummeryTbl = true
        }
        balancetoMfgQty = orderSummeryNos - avlinStkNos
        if (balancetoMfgQty > 0) {
          notifySuccess(`තවත් ටයර් ${balancetoMfgQty} නිශ්පාදනය කිරීමට ඇත`)
          //Work order verification
          if (pidAvlInOrderSummeryTbl) {
            if (edc1stTire == 0 || edc1stTire == 2) {
              if (specVerMatch) {
                if (specAvl) {
                  //Spec not avialble is not a possible case since cards can not be printed
                  SLTLDBConnection.get(
                    `sizebasic/gettcatbytirecode/${tireCodeInput.slice(0, 5)}`,
                  ).then((res) => {
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
                      //Show PressNo Enter model
                      showPressEnterRemotely(true)
                    } else {
                      //Spec version is not OK
                    }
                  })
                }
              } else {
                //Spec version does not match
                refreshTireCodeInput()
                notifyError('පැරණි කාඩ්පතකි. අලුත් කාඩ්පතක් ගන්න ')
                notifyError(specDetail?.data?.data?.spec?.specversion.toString())

                //Hide PressNo Enter model
                showPressEnterRemotely(false)
              }
            } else if (edc1stTire == 1) {
              //EDC 1st Tire
              refreshTireCodeInput()
              notifyError('"EDC 1st Tire" ටයර් නිශ්පාධනය කල නොහැක')
              //Hide PressNo Enter model
              showPressEnterRemotely(false)
            }
          } else {
            refreshTireCodeInput()
            notifyError(`"Work order " එක ට ${pid}ඇතුලත් කරන්න`)
          }
        } else {
          refreshTireCodeInput()
          notifyError(`මෙම POD  එකෙන් ටයර් නිශ්පාඪනය සම්පූර්න වී ඇත.`)
        }
      })
    })
  }
  //10011103
  //--------------------------ada---------------------------------------------------
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
      //if manualy change Serial Number this triggering should not be not happened
      if (!isNxtSnChangeSetTrue) {
        getDateTimedb()
        SLTLDBConnection.get(`builder/nextsn`).then((res) => {
          setNxtSN(res.data)
        })
      }
    }, 200)
    return () => {
      clearInterval(timer)
    }
  }, [])
  useEffect(() => {
    SLTLDBConnection.get(`stk/getsnavl/${nxtSN}`)
      .then((res) => {
        if (res.data.data.rowCount != 0) {
          setisSnAvlinStockTbl(true)
        } else {
          setisSnAvlinStockTbl(false)
        }
      })
      .catch((e) => console.log(e.message))
  }, [nxtSN])

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

  //Scale Reading
  useEffect(() => {
    if (scale.reading !== undefined) {
      setScaleReadingBand(scale.reading.reading.wgtReading)
    }
  }, [scale])
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
        notifyError('පැරණි කාඩ් එකකි.')
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
      //setShowPressEnter(true)
    } else {
      dispatch(resetSpec()) //Reset the spec
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
  //useEffect for pressNo Enter
  useEffect(() => {
    if ((pressNo.length == 5) & (pressNo.charAt(0) == 'p') || pressNo.charAt(0) == 'P') {
      setShowPressEnter(false)
    }
  }, [pressNo])

  const handleClickRefresh = () => {
    inputRef.current.focus()
    window.location.reload()
    setTireCodeInput('')
  }
  const bandSticker = async () => {
    // Print the barcode
    let zpl = `^XA^FO${PRINT_X + 60},${PRINT_Y - 1}^BY2 ^BCN,120,Y,N,S^FDS${parseFloat(
      scaleReadingBand,
    ).toFixed(2)}L^XZ`
    //zpl = `^XA^FO${PRINT_X + 60},${PRINT_Y - 1}^BY1 ^BCN,120,Y,N,S^FDS3.37L^XZ`
    const updateBarCode = await printerHost.put(`/bc`, { zpl, bcprinter: 1 })
  }
  const reprint = () => {
    const prevSn = nxtSN - 1
    SLTLDBConnection.get(`builder_temp/getrow/${prevSn}`)
      .then((res) => {
        if (res.data.data.data[0].zpl) {
          const zpl = res.data.data.data[0].zpl
          printerHost.put(`/bc`, { zpl, bcprinter: 1 })
        } else {
          notifyError('Network problem')
        }
      })
      .catch((e) => console.log(e.message))
  }
  return (
    <Row>
      <Col sm={3}>
        <div style={{ marginTop: '50px', marginRight: 0 }}>
          <SpecDisplayComp />
        </div>
        <TireCodeInputComp
          inputRef={inputRef}
          tireCodeInput={tireCodeInput}
          disableInputTireCode={disableInputTireCode}
          onBandBarcodeChange={setBandBarCodeInputFun}
          onTireCodeBarCodeChange={setTirecodeInputFun}
          showPressEnterRemotely={showPressEnterRemotely}
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
            <TtlWgtDisplayComp
              bandwgt_for_calculation={bandwgt_for_calculation}
              nxtSN={!isNxtSnChangeSetTrue ? nxtSN : changedNxtSN}
            />
          </div>
        )}
        <div className="col text-center mt-5">
          <h1>
            <Badge bg="info">{!isNxtSnChangeSetTrue ? nxtSN : changedNxtSN}</Badge>
          </h1>
          <h1>
            <Badge bg="info">{isSnAvlinStockTbl ? 'මෙම SMය පෙර භාවිත කර ඇත' : ''}</Badge>
          </h1>
          <div className="col text-center mt-5">
            <Button variant="secondary" onClick={handleShowSNChange}>
              Change SN
            </Button>
            <Button className="m-3" variant="danger" onClick={bandSticker}>
              බෑන්ඩ් බර ස්ටිකරය
            </Button>
            <Button className="m-3" variant="danger" onClick={reprint}>
              පෙර ස්ටිකරය
            </Button>
          </div>
          {isNxtSnChangeSetTrue ? <Badge bg="danger">SN Changed</Badge> : ''}
        </div>
      </Col>
      {/* Model for SN Change */}
      <Modal show={showSNChange} onHide={handleCloseSNChange} backdrop="static">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>New Serial Number</Form.Label>
              <Form.Control
                className="mb-3 fs-1"
                type="number"
                autoFocus
                value={changedNxtSN}
                onChange={(e) => handleNxtSNChange(e)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleChangeSNButtonModel}>
            Change SN
          </Button>
        </Modal.Footer>
      </Modal>
      {/* 
      --------------Model 2
      */}
      <Modal show={showPressEnter} onHide={handleClosePressEnter} backdrop="static">
        <Modal.Header>
          <Modal.Title>ප්‍රෙස් නොම්බරය</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3 fs-1" controlId="exampleForm.ControlInput1">
              <Form.Control
                className="mb-3 fs-1"
                type="text"
                autoFocus
                value={pressNo}
                onChange={(e) => handlePressNoEnter(e)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </Row>
  )
}

export default TireBuilderView
