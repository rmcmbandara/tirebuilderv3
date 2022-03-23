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
const TireBuilderView = () => {
  //States and Refs-----------------------------
  //these 3 states for specAvl,tireCodeAvl and SpecVerMatch
  const [specAvl, setSpecAvl] = useState(false)
  const [tireCodeAvl, setTireCodeAvl] = useState(false)
  const [specVerMatch, setSpecVerMatch] = useState(false)
  //Get next SN
  const [nxtSN, setNxtSN] = useState(0)

  const inputRef = useRef()

  //Handlers and Methods-------------------------
  const clickHander = () => {
    inputRef?.current.focus()
  }

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
    }, 500)
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
  ///////////////////////////////
  var mvavArr = []

  //States----------------------------
  const [stblTimeOutSetting, setStblTimeOutSetting] = useState(1000)
  const [scaleReadingx, setScaleReadingx] = useState(0)

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
        <TireCodeInputComp inputRef={inputRef} />
      </Col>
      <Col sm={3}></Col>
      <Col sm={3}>
        <div style={{ marginTop: '50px', marginRight: 0 }}>
          <TtlWgtDisplayComp />
        </div>
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
