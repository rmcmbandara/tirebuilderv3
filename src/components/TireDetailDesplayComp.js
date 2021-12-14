import React from 'react'
import { Card, Row, Col } from 'react-bootstrap'
import { useSelector } from 'react-redux'

const TireDetailDesplayComp = () => {
  const tireCodeDetail = useSelector((state) => state.tireCodeDetails)

  const swmsg = tireCodeDetail?.data?.data?.data[0]?.swmsg
  const brand = tireCodeDetail?.data?.data?.data[0]?.brand
  const rimsize = tireCodeDetail?.data?.data?.data[0]?.rimsize
  const tiresizebasic = tireCodeDetail?.data?.data?.data[0]?.tiresizebasic
  const config = tireCodeDetail?.data?.data?.data[0]?.config
  const lugtypecap = tireCodeDetail?.data?.data?.data[0]?.lugtypecap
  const tiretypecap = tireCodeDetail?.data?.data?.data[0]?.tiretypecap
  const color = tireCodeDetail?.data?.data?.data[0]?.color
  const moldno = tireCodeDetail?.data?.data?.data[0]?.moldno
  return (
    <Row>
      <Col lg={10}>
        <Card border="warning">
          <Card.Title style={{ fontSize: '25px', color: 'blue' }}>
            {tiresizebasic} {lugtypecap} {config} {rimsize} {tiretypecap} {brand} {swmsg}
          </Card.Title>
          <Card.Title>{config == 'APW' ? `Wheel Color- ${color}` : ''}</Card.Title>{' '}
        </Card>
      </Col>
      <Col lg={2}>
        <Card border="warning">
          <Card.Title style={{ color: 'blue' }}>Mold:-{moldno}</Card.Title>
        </Card>
      </Col>
    </Row>
  )
}

export default TireDetailDesplayComp
