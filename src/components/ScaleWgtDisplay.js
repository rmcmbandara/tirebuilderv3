import React, { useEffect, useState } from 'react'
import { Button, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { rng } from 'src/utils/moveingaverage'

import { setStabilityAbsolute, setStability } from '../redux/scalStability/stabilityActions'
var mvavArr = []
const WgtDisplay = () => {
  //States--------------------------------------------
  const [scaleReading, setScaleReading] = useState(0)
  const [stblTimeOutSetting, setStblTimeOutSetting] = useState(1000)
  //Redux-------------------------------------------
  const scale = useSelector((state) => state.scaleData)
  const stabilityDetail = useSelector((state) => state.stabilityDetails)
  const { settingWgt, stable, toleranceWgt, ignoreSettingWgt } = stabilityDetail //Destructre stability Detail
  const dispatch = useDispatch()

  useEffect(() => {
    if (scale?.reading?.reading) {
      setScaleReading(scale?.reading?.reading?.wgtReading)
      //-------------------------------
      //Time series calculation for IH
      //NO of elemets is 5
      if (mvavArr.length === 5) {
        mvavArr.shift()
      }
      if (mvavArr.length < 5) {
        mvavArr.push(Number(scaleReading))
      }
      const mvav = rng(4, 4, mvavArr)
      const diff = Math.abs(scaleReading - mvav)

      //Absolute Stability
      if (diff < 0.03) {
        dispatch(setStabilityAbsolute(true))
      } else {
        dispatch(setStabilityAbsolute(false))
      }
      //setting Wgt
      if (!ignoreSettingWgt) {
        var lr = {}

        const sto = { reading: scaleReading, time: Date.now() }
        try {
          lr = JSON.parse(localStorage.getItem('cr'))
        } catch (err) {
          localStorage.setItem('cr', JSON.stringify(sto))
          console.log(err)
        }
        var inRange = false
        if (lr.reading !== scaleReading) {
          if (
            scaleReading - settingWgt > -toleranceWgt &&
            scaleReading - settingWgt < toleranceWgt
          ) {
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
      }
    }
  }, [scale])

  return (
    <Card>
      <Card.Body>
        <div className="col text-center">
          <p style={{ fontSize: '50px' }}>{scaleReading && scaleReading}</p>
        </div>
      </Card.Body>
    </Card>
  )
}
export default WgtDisplay
