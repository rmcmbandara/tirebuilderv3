import React, { useState, useEffect } from 'react'
import { Button, Col, Dropdown, DropdownButton, Form, Row, Stack } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import SLTLDBConnection from '../../../src/apis/SLTLDBConnection'
import { notifyError } from 'src/utils/toastify'
import ListComp from '../../zDel/ListComp'
import TireSizeBasic from './individualListCreators/TireSizeBasicLstCreator'
import LugTypeLstCreator from './individualListCreators/LugTypeListCreator'
import ConfigListCreator from './individualListCreators/ConfigListCreator'
import RimSizeCreator from './individualListCreators/RimSizeListCreator'
import BrandNameLstCreator from './individualListCreators/BrandNameListCreator'
import SwMsgLstCreator from './individualListCreators/SwMsgListCreator'
import TireTypeLstCreator from './individualListCreators/TireTypeListCreator'
import 'react-dropdown/style.css'
import TireSizeBasicLstCreator from './individualListCreators/TireSizeBasicLstCreator'
import RimSizeLstCreator from './individualListCreators/RimSizeListCreator'
import ConfigLstCreator from './individualListCreators/ConfigListCreator'
import WheelColorLstCreator from './individualListCreators/WheelColorListCreator'
const PidUpdate = () => {
  const [data, setData] = useState([])
  const [refinedArr, setRefinedArr] = useState([])
  const [selectedDetailState, setSelectedDetailState] = useState({
    tireSize: 'Tire Size',
    lugType: 'Lug Type',
    config: 'Configuration',
    tireType: 'Tire Type',
    rimSize: 'Rim',
    swMsg: 'Side Wall',
    brandName: 'Brand',
    wheelColor: 'Wheel Color',
  })

  //Drop Down Click Handler id dropDownName,value is descrbed in DropDwonComp.js
  const handler = (id, value, dropDownName) => {
    switch (dropDownName) {
      case 'tireSize':
        setSelectedDetailState((prevState) => ({
          ...prevState,
          tireSize: value,
        }))
        break
      case 'swMsg':
        setSelectedDetailState((prevState) => ({
          ...prevState,
          swMsg: value,
        }))
        break
      case 'rimSize':
        setSelectedDetailState((prevState) => ({
          ...prevState,
          rimSize: value,
        }))
        break
      case 'tireType':
        setSelectedDetailState((prevState) => ({
          ...prevState,
          tireType: value,
        }))
        break
      case 'lugType':
        setSelectedDetailState((prevState) => ({
          ...prevState,
          lugType: value,
        }))
        break
      case 'config':
        setSelectedDetailState((prevState) => ({
          ...prevState,
          config: value,
        }))
        break
      case 'brandName':
        setSelectedDetailState((prevState) => ({
          ...prevState,
          brandName: value,
        }))
        break
      case 'wheelColor':
        setSelectedDetailState((prevState) => ({
          ...prevState,
          wheelColor: value,
        }))

        break
      default:
        return
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const info = await SLTLDBConnection.get(`/sizebasic/getallsizebasic`)
        //for valied sn only
        if (info.data) {
          setData(info.data.rows)
        } else {
        }
      } catch (err) {
        notifyError(err.message)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (data) {
      const x = data.map((value) => {
        const obj = {}
        obj.id = value.sizebasicid
        obj.value = value.tiresizebasic
        return obj
      })

      setRefinedArr(x)
    }
  }, [data])

  return (
    <div className="container">
      <Stack direction="horizontal" gap={1}>
        <TireSizeBasicLstCreator
          clickeventfrmMain={handler}
          selectedDetailState={selectedDetailState}
        />
        <div className="vr" />
        <LugTypeLstCreator clickeventfrmMain={handler} selectedDetailState={selectedDetailState} />
        <div className="vr" />
        <ConfigLstCreator clickeventfrmMain={handler} selectedDetailState={selectedDetailState} />
        <div className="vr" />
        <TireTypeLstCreator clickeventfrmMain={handler} selectedDetailState={selectedDetailState} />
        <div className="vr" />
        <RimSizeLstCreator clickeventfrmMain={handler} selectedDetailState={selectedDetailState} />
        <div className="vr" />
        <BrandNameLstCreator
          clickeventfrmMain={handler}
          selectedDetailState={selectedDetailState}
        />
        <div className="vr" />
        <SwMsgLstCreator clickeventfrmMain={handler} selectedDetailState={selectedDetailState} />

        <div className="vr" />
        <WheelColorLstCreator
          clickeventfrmMain={handler}
          selectedDetailState={selectedDetailState}
        />
      </Stack>
    </div>
  )
}
export default PidUpdate
