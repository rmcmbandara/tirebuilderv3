import React from 'react'
import { Col, Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
const BandWgtScanComp = ({ bandRef }) => {
  return (
    <>
      <Col xs={8}>
        <Form.Control
          ref={bandRef}
          size="lg"
          type="text"
          pattern="[0-9]*"
          placeholder="Tire Code..."
          value="lankasdf;lksaf;"
          maxLength="8"
        />
      </Col>
    </>
  )
}

BandWgtScanComp.propTypes = {
  bandRef: PropTypes.object,
}

export default BandWgtScanComp
