import React, { useEffect, useState } from 'react'
import { Badge, Button, Card, Nav, ProgressBar } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import SLTLDBConnection from 'src/apis/SLTLDBConnection'
import { getSpecDetailsList } from 'src/utils/specDetailCreator'
import { setSettingWgt } from '../../redux/scalStability/stabilityActions'
import { getTtlWgtTol } from '../../utils/finalWgtTolleranceCreator'
import { setMaxTol, setMinTol } from '../../redux/scalStability/stabilityActions'
import { propTypes } from 'react-bootstrap/esm/Image'
import PropTypes from 'prop-types'
import { notifyError, notifySuccess, notifySuccessQk } from 'src/utils/toastify'
import { PRINT_X, PRINT_Y, STABILITY_WAITING, TIMER_INTERVAL } from 'src/utils/constants'
import printerHost from 'src/apis/printerHost'
import axios from 'axios'
const TtlWgtDisplayComp = ({ bandwgt_for_calculation, nxtSN }) => {
  //States--------------------------------------------
  const [specDetailObj, setSpecDetailObj] = useState({})
  const [bandWgtDisplay, setBandWgtDisplay] = useState('0')
  const [ttlWgt, setTtlWgt] = useState(0)
  const [scaleReading, setScaleReading] = useState(0)
  const [counter, setCounter] = useState(0)
  const [inRange, setInRange] = useState(false)
  const [timeOutCountValue, setTimeOutCountValue] = useState(30)
  const [timeOutPercentate, setTimeOutPercentate] = useState(0)

  const [edc1sttire, setEdc1sttire] = useState()
  //for autoprintout stop for one tire
  const [isPrinted, setIsPrinted] = useState(false)
  //Redux Selectors-------------------------------------
  const specDetail = useSelector((state) => state.specDetails)
  const tireCodeDetail = useSelector((state) => state.tireCodeDetails)
  const bandWgts = useSelector((state) => state.bandWgts)
  const { settingWgt, maxTol, minTol } = useSelector((state) => state.stabilityDetails)
  const { actBandWgt, specBandWgt } = useSelector((state) => state.bandWgts)
  const isSrt = useSelector((state) => state.isSrt)
  const scale = useSelector((state) => state.scaleData)
  const dispatch = useDispatch()
  const tireCodeTxt = useSelector((state) => state.tireCodeText)
  const dataAvlReducer = useSelector((state) => state.dataAvlReducer)
  //Variable Decalrations
  const [wgtLst, setWgtLst] = useState([]) //Compound Detail List
  //------------------------------------------------------------
  //Destructer tire Detail
  const tiresizebasic = tireCodeDetail?.data?.data?.data[0]?.tiresizebasic
  const config = tireCodeDetail?.data?.data?.data[0]?.config
  const lugtypecap = tireCodeDetail?.data?.data?.data[0]?.lugtypecap
  const swmsg = tireCodeDetail?.data?.data?.data[0]?.swmsg
  const brand = tireCodeDetail?.data?.data?.data[0]?.brand
  const rimsize = tireCodeDetail?.data?.data?.data[0]?.rimsize
  const tiretypecap = tireCodeDetail?.data?.data?.data[0]?.tiretypecap
  const color = tireCodeDetail?.data?.data?.data[0]?.color
  const moldno = tireCodeDetail?.data?.data?.data[0]?.moldno
  //Destructure
  const { tcAvl, specVerMatch, edc1stTire, specAvl } = dataAvlReducer
  //EDC 1st Tire
  useEffect(() => {
    setEdc1sttire(edc1stTire)
  }, [edc1stTire])
  //UseEffect for scale reading detection
  useEffect(() => {
    if (scale?.reading?.reading) {
      if (scale?.reading?.reading?.wgtReading) {
        setScaleReading(scale?.reading?.reading?.wgtReading)
        if (
          Number(minTol) <= Number(scale?.reading?.reading?.wgtReading) &&
          Number(maxTol) > Number(scale?.reading?.reading?.wgtReading)
        ) {
          setInRange(true)
        } else {
          setInRange(false)
        }
      }
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

          //Ammend the last ekement POB Tires But Not for APW Tires
          if (config != 'APW') {
            wgtLst[wgtLst.length - 1].wgt = parseFloat(lastelementWgt) + parseFloat(trWgtAdj)
          }
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
  //*******************-----Timer--------------************************
  //Setup the timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevCounter) => prevCounter + 1)
    }, TIMER_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  //Reset the counter value
  useEffect(() => {
    setCounter(0)
  }, [inRange])

  //Counter calculations
  useEffect(() => {
    setTimeOutCountValue(STABILITY_WAITING * (1000 / TIMER_INTERVAL))
    if (inRange && timeOutCountValue < counter && !isPrinted) {
      setIsPrinted(true)
      clickHandler()
    }

    const percentage = Number((counter * 100) / timeOutCountValue).toFixed(0)
    if (percentage > 100) {
      setTimeOutPercentate(100)
    } else {
      setTimeOutPercentate(percentage)
    }

    //`${Number((counter * 100) / timeOutCountValue).toFixed(0)}%`
  }, [counter])
  //-------------------------------------------------------------------------------------
  //Functions and Hanlers
  //************************************************************************************ */

  function timeout(delay) {
    return new Promise((res) => {
      setTimeout(res, delay)
      window.location.reload()
    })
  }
  const clickHandler = () => {
    //This function is because server machine lags time of 12hr and 34 min
    Date.prototype.addHours = function (h, m) {
      this.setTime(this.getTime() + h * 60 * 60 * 1000 + m * 60 * 1000)
      return this
    }
    var currentdate = new Date().addHours(12, 30)
    var datetime =
      currentdate.getFullYear() +
      '-' +
      currentdate.getMonth() +
      '-' +
      currentdate.getDate() +
      ' ' +
      currentdate.getHours() +
      ':' +
      currentdate.getMinutes() +
      ':' +
      currentdate.getSeconds() +
      '.00000'
    var mfgdate = datetime
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
    SLTLDBConnection.post(`builder_temp/insertsn`, {
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
      tc,
      pid,
      edc1sttire,
      mfgdate,
    })
      .then((res1) => {
        if (res1.status == 200) {
          //Print Out-------------------------------------------------------------------------
          const zpl = `^XA
   ^FO${PRINT_X + 20},12
   ^AM,20,10
   ^FD${tiresizebasic} ${config} ${lugtypecap}^FS
   ^FO${PRINT_X + 20},38
   ^AM,20,10
   ^FDMNO-${moldno} ${!isSrt ? actBandWgt : ''}//${tiretypecap} ${rimsize}^FS
   ^FO${PRINT_X + 20},65
   ^AM,20,10
   ^FD${brand} ${swmsg}^FS
   ^FO${PRINT_X + 20},85
   ^AM,20,10^FD${parseFloat(scaleReading)}   ${datetime}^FS
   ^FO${PRINT_X + 20},105
   ^AM,20,10^FD${nxtSN}^FS
   ^FO${PRINT_X + 35},125
   ^BY1 ^BCN,60,Y,N,S^FD ${nxtSN}
   ^XZ
   `
          printerHost
            .put(`/bc`, { zpl, bcprinter: 1 })
            .then((res2) => {
              console.log(res2.status)
              if (res1.status == 200) {
                console.log('asdfS')
              } else {
                notifyError(res1)
              }
              window.location.reload()
            })
            .catch((e) => {
              notifyError('ප්‍රින්ටර් සර්වර් එකේ නෙට්වර්ක් ප්‍රශ්නයකි. ටයරය එන්ටර් වී ඇත')
              notifyError(e.message + ' in printer server')
              timeout(5000)
            })
        } else {
          notifyError(res1)
        }
      })
      .catch((e) => {
        if (e.message == 'Request failed with status code 409')
          notifyError('මීට පෙර බිල්ඩ් කරන ලද ටයරකි')
        notifyError(e.message)
      })
  }
  //----------------------------------------------------------
  return (
    <Card className="text-center" style={{ minWidth: '600px' }}>
      <Card.Header>
        <Badge style={{ fontSize: '60px' }} bg="light" text="primary">
          {settingWgt.toFixed(2)}
        </Badge>
      </Card.Header>
      <Card.Header>
        <Badge style={{ fontSize: '40px' }} bg="warning" text="primary">
          {minTol.toFixed(2)}
        </Badge>
        <Badge style={{ fontSize: '60px' }} bg="light" text="dark">
          {Number(scaleReading).toFixed(2)}
        </Badge>
        <Badge style={{ fontSize: '40px' }} bg="warning" text="primary">
          {maxTol.toFixed(2)}
        </Badge>
      </Card.Header>
      <Card.Body>
        <div className="col text-center mt-5">
          {inRange ? (
            <div className="mb-1">
              <ProgressBar>
                <ProgressBar
                  variant="success"
                  max={timeOutCountValue}
                  now={counter}
                  key={1}
                  label={timeOutPercentate + '%'}
                />
              </ProgressBar>
            </div>
          ) : (
            <></>
          )}
        </div>
      </Card.Body>
      <Button onClick={clickHandler}>Ener</Button>
    </Card>
  )
}
TtlWgtDisplayComp.propTypes = {
  bandwgt_for_calculation: propTypes.number,
  nxtSN: propTypes.number,
}
export default TtlWgtDisplayComp
