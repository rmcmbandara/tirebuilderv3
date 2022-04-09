import React, { useEffect, useState } from 'react'
import { Button, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { rng } from 'src/utils/moveingaverage'

import {
  setStabilityAbsolute,
  setStability,
  setMovingAvg,
  setMovingAvg2,
} from '../redux/scalStability/stabilityActions'

//import constats for stability

import {
  MOVING_AVERAGE_ARRAY_LENGTH,
  IFFERENCE_SMALL_TIRES,
  DIFFERENCE_LARGE_TIRES,
  DIFFERENCE_MIDIAM_TIRES,
} from '../utils/constants'

var mvavArr = []
const { TIMEX } = process.env
const WgtDisplay = () => {
  //States--------------------------------------------
  const [scaleReading, setScaleReading] = useState(0)
  const [stblTimeOutSetting, setStblTimeOutSetting] = useState(1000)
  //Redux-------------------------------------------
  const scale = useSelector((state) => state.scaleData)
  const stabilityDetail = useSelector((state) => state.stabilityDetails)
  const { settingWgt, stable, toleranceWgt, ignoreSettingWgt, movingAverage } = stabilityDetail //Destructre stability Detail
  const dispatch = useDispatch()
  //UseEffect for scale reading detection
  useEffect(() => {
    if (scale?.reading?.reading) {
      setScaleReading(scale?.reading?.reading?.wgtReading)
      //-------------------------------
      //Time series calculation for IH
      //NO of elemets is 5
      if (mvavArr.length === parseInt(MOVING_AVERAGE_ARRAY_LENGTH)) {
        mvavArr.shift()
      }
      if (mvavArr.length < parseInt(MOVING_AVERAGE_ARRAY_LENGTH)) {
        mvavArr.push(Number(scaleReading))
      }

      //Get Moving Average
      const mvav = rng(3, 3, mvavArr)
      //Difference between scale reading and moving average
      dispatch(setMovingAvg(mvav))
      const diff = Math.abs(scaleReading - mvav)

      //Absolute Stability
      if (diff < 0.05) {
        dispatch(setStabilityAbsolute(true))
      } else {
        dispatch(setStabilityAbsolute(false))
      }
    }
  }, [scale])

  return (
    <Card>
      <Card.Body>
        <div className="col text-center">
          <p style={{ fontSize: '65px' }}>{scaleReading && scaleReading}</p>
          <p style={{ fontSize: '65px' }}>{movingAverage && movingAverage.toFixed(2)}</p>
        </div>
      </Card.Body>
    </Card>
  )
}
export default WgtDisplay

/*

 //setting Wgt
      var lr = {}
      //sto-Current time and scale reading
      const sto = { reading: scaleReading, time: Date.now() }
      //Store current time
      try {
        lr = JSON.parse(localStorage.getItem('cr')) //Get lr(last stored lr)
      } catch (err) {
        localStorage.setItem('cr', JSON.stringify(sto))
        console.log(err)
      }
      var inRange = false
      if (lr.reading !== scaleReading) {
        if (scaleReading - settingWgt > -toleranceWgt && scaleReading - settingWgt < toleranceWgt) {
          //With in range
          //Do nothing
          inRange = true
          //  console.log('in Range');+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        } else {
          //Out of range
          inRange = false
          dispatch(setStability(false))
          localStorage.setItem('cr', JSON.stringify(sto))
          //    console.log('Out Range');
        }
      }
      if (Date.now() - lr.time > stblTimeOutSetting) {
        //Waiting Time paseded. OK
        if (inRange) {
          dispatch(setStability(true))
        }
      } else {
        //Waiting Time
        dispatch(setStability(false))
      }

*/
