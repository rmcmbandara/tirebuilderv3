import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { Button, Col, Dropdown, DropdownButton, Form, Row, Stack } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import SLTLDBConnection from '../../../src/apis/SLTLDBConnection'
import { notifyError } from 'src/utils/toastify'
import { getPidDetail } from '../pidUpdate/httpRequests/pidDetailforPid'

import { connect, useDispatch, useSelector } from 'react-redux'
import { setStability, setStabilityAbsolute } from '../../redux/scalStability/stabilityActions'
import { toggleSideBarShow } from '../../redux/sideBarShow/sideBarShowActions'

import { incrementCountAction } from '../../actions'
import { propTypes } from 'react-bootstrap/esm/Image'

//Reduc

const SpecUpdate = () => {
  //Destructre stability Detail

  const stabilityDetail = useSelector((state) => state.stabilityDetails)
  const blnSideBarShow = useSelector((state) => state.sidebarShow)
  const { settingWgt, stability, toleranceWgt, ignoreSettingWgt } = stabilityDetail
  const dispatch = useDispatch()

  const clickHandler = () => {
    dispatch(toggleSideBarShow(!blnSideBarShow))
  }
  return <div className="App"></div>
}

export default SpecUpdate
