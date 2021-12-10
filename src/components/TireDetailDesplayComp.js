import React from 'react'
import { Card, Row, Col } from 'react-bootstrap'
import { useSelector } from 'react-redux'

const TireDetailDesplayComp = () => {
  const tireCodeDetail = useSelector((state) => state.tireCodeDetails)
  const { swmsg, brand, rimsize, tiresizebasic, config, lugtypecap, tiretypecap, color, moldno } =
    tireCodeDetail?.data?.data?.data[0]

  return (
    <Row>
      <Col lg={10}>
        <Card border="warning">
          <Card.Title style={{ fontSize: '30px', color: 'blue' }}>
            {tiresizebasic} {lugtypecap} {config} {rimsize} {tiretypecap} {brand} {swmsg}
          </Card.Title>
          <Card.Title>{config == 'APW' ? `Wheel Color- ${color}` : ''}</Card.Title>{' '}
        </Card>
      </Col>
      <Col lg={2}>
        <Card border="warning">
          <Card.Title>Mold:-{moldno}</Card.Title>
        </Card>
      </Col>
    </Row>
  )
}

export default TireDetailDesplayComp
