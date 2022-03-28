import React, { useCallback } from 'react'
import { Col, Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
const BandWgtScanComp = ({ bandRef, onBandBarcodeChange, bandBarCodeInput }) => {
  const handleInputChange = useCallback(
    (event) => {
      onBandBarcodeChange(event.target.value)
    },
    [onBandBarcodeChange],
  )
  return (
    <>
      <Col xs={8}>
        <Form.Control
          ref={bandRef}
          size="lg"
          type="text"
          pattern="[0-9]*"
          placeholder="scan band stiker"
          onChange={handleInputChange}
          value={bandBarCodeInput}
        />
      </Col>
    </>
  )
}

BandWgtScanComp.propTypes = {
  bandRef: PropTypes.object,
  specAvlChangeHandler: PropTypes.func,
  bandBarCodeInput: PropTypes.number,
  onBandBarcodeChange: PropTypes.func,
}

export default BandWgtScanComp
