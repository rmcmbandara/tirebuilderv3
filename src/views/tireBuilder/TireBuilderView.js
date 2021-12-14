import PropTypes from 'prop-types'
import React, { useState, useEffect, useRef } from 'react'
import { Button, Col, Dropdown, DropdownButton, Form, Row, Stack } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import SLTLDBConnection from '../../../src/apis/SLTLDBConnection'
import { notifyError } from 'src/utils/toastify'
import { getPidDetail } from '../pidUpdate/httpRequests/pidDetailforPid'
import { connect } from 'react-redux'

import { incrementCountAction } from '../../actions'
import { propTypes } from 'react-bootstrap/esm/Image'
import TireCodeInputComp from 'src/components/bilder/TireCodeInputComp'
import { getSpecDetailsList } from 'src/utils/specDetailCreator'
import SpecDisplayComp from 'src/components/bilder/SpecDisplayComp'
const TireBuilderView = () => {
  //States and Refs-----------------------------
  //these 3 states for specAvl,tireCodeAvl and SpecVerMatch
  const [specAvl, setSpecAvl] = useState(false)
  const [tireCodeAvl, setTireCodeAvl] = useState(false)
  const [specVerMatch, setSpecVerMatch] = useState(false)
  const inputRef = useRef()

  //Handlers and Methods-------------------------
  const clickHander = () => {
    inputRef?.current.focus()
  }
  useEffect(() => {
    inputRef?.current.focus()
  }, [])
  return (
    <div>
      <TireCodeInputComp
        inputRef={inputRef}
        specAvlChangeHandler={(val) => {
          setSpecAvl(val)
        }}
        tireCodeAvlChangeHandler={(val) => {
          setTireCodeAvl(val)
        }}
        specVerMachHandler={(val) => {
          setSpecVerMatch(val)
        }}
      />
      <div style={{ marginTop: '50px', marginRight: 0 }}>
        <SpecDisplayComp />
      </div>
    </div>
  )
}

export default TireBuilderView
