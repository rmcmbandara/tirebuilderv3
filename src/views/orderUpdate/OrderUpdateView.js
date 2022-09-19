import React, { useEffect, useRef, useState } from 'react'
import { FormControl, InputGroup, Modal, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import SLTLDBConnection from 'src/apis/SLTLDBConnection'
import { scaleReading } from 'src/redux/scale/scaleActions'
import { getBandWgtTol } from 'src/utils/bandWgtTol'
import BandWgtModel, { bandWgtCard } from '../../components/bandStikerPrint/BandWgtCard'
const OrderUpdateView = () => {
  const readExcel = (file) => {
    console.log('fuck')
  }
  return (
    <>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files[0]
          readExcel()
        }}
      />
    </>
  )
}

export default OrderUpdateView
