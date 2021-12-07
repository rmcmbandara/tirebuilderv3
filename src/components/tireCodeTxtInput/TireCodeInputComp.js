import React from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'

const TireCodeInputComp = () => {
  return (
    <div>
      <Col xs={2}>
        <Form.Control size="lg" type="text" placeholder="Tire Code..." />
      </Col>
    </div>
  )
}

export default TireCodeInputComp
