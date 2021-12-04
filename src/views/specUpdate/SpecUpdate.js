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
const SpecUpdate = ({ myCount, incrementMyCount }) => {
  return (
    <div className="App">
      <button onClick={incrementMyCount}>{myCount}</button>
    </div>
  )
}

const mapStateToProps = (state) => ({ myCount: state.count })

const mapDispatchToProps = {
  incrementMyCount: incrementCountAction,
}
SpecUpdate.propTypes = {
  myCount: PropTypes.number,
  incrementMyCount: PropTypes.func,
}
export default connect(mapStateToProps, mapDispatchToProps)(SpecUpdate)
