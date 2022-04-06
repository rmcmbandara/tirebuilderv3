import React, { useEffect, useState } from 'react'
import { getSpecDetailsList } from 'src/utils/specDetailCreator'
import { useSelector } from 'react-redux'
import { Badge, Card, Col, Row, Table, Toast, Button } from 'react-bootstrap'

const SpecDisplayComp = () => {
  //States
  const [specDetailObj, setSpecDetailObj] = useState({})
  const [bandWgtDisplay, setBandWgtDisplay] = useState('0')

  //Redux Selectors
  const specDetail = useSelector((state) => state.specDetails)
  const tireCodeDetail = useSelector((state) => state.tireCodeDetails)
  const dataAvl = useSelector((state) => state.dataAvlReducer)
  const tireCodeTxt = useSelector((state) => state.tireCodeText)

  //Compound Detail List
  const [lst, setLst] = useState([])

  //Get the Band Details
  const band = tireCodeDetail?.data?.data?.data[0]?.band
  const bandid = tireCodeDetail?.data?.data?.data[0]?.bandid
  const bandwgt = tireCodeDetail?.data?.data?.data[0]?.bandwgt

  const specAvl = dataAvl?.specAvl
  //SpecDetail useEffect
  //Check for spec Availability and if avl get the comp and wgts as an array
  useEffect(() => {
    setLst(getSpecDetailsList())
    //Set bandWgtDisplay
    if (bandwgt) {
      setBandWgtDisplay(parseFloat(bandwgt).toFixed(2))
    }
  }, [specDetail])
  var renderTable

  const displayComp = () => (
    <Row>
      <div>
        <h3>
          <Badge bg="success">Compound</Badge>
        </h3>
      </div>
      <Col>
        <Table striped bordered hover responsive="sm">
          <thead>
            <tr>
              <th></th>
              <th>Wgt</th>
            </tr>
          </thead>
          <tbody>
            {lst &&
              lst.map((x, i) => (
                <tr key={i}>
                  <td size="lg">{x.comp}</td>
                  <td>{x.wgt}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Col>
    </Row>
  )
  const displayBand = () => (
    <Row>
      <div>
        <h3>
          <Badge bg="warning">Band</Badge>
        </h3>
      </div>
      <Col>
        <Table striped bordered hover responsive="sm">
          <tbody>
            <tr>
              <td>{band}</td>
              <td>{bandWgtDisplay}</td>
            </tr>
          </tbody>
        </Table>
      </Col>
    </Row>
  )
  return (
    <div>
      {/* Display Compound details */}
      <div>{lst?.length > 0 && displayComp()}</div>

      {/* Display Spec Not Available Batch if spec is not avl */}
      <div>
        {tireCodeTxt?.data?.length === 8 ? (
          specAvl ? (
            ''
          ) : (
            <Card bg={'danger'} className="mb-5" text={'white'} style={{ width: '18rem' }}>
              <Card.Body>
                <Card.Title>Spec නැත</Card.Title>
              </Card.Body>
            </Card>
          )
        ) : (
          ''
        )}
      </div>
      <div>{!band || (band != '0' && displayBand())}</div>
    </div>
  )
}

export default SpecDisplayComp
