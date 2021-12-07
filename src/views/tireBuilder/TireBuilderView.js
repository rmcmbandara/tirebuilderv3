import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { Button, Col, Dropdown, DropdownButton, Form, Row, Stack } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import SLTLDBConnection from '../../../src/apis/SLTLDBConnection'
import { notifyError } from 'src/utils/toastify'
import { getPidDetail } from '../pidUpdate/httpRequests/pidDetailforPid'
import { connect } from 'react-redux'

import { incrementCountAction } from '../../actions'
import { propTypes } from 'react-bootstrap/esm/Image'
import TireCodeInputComp from 'src/components/tireCodeTxtInput/TireCodeInputComp'
const TireBuilderView = () => {
  return (
    <div>
      <TireCodeInputComp />
    </div>
  )
}

export default TireBuilderView
