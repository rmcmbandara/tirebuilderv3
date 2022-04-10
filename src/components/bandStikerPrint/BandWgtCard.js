import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { getBandWgtTol } from 'src/utils/bandWgtTol'
import { notifyError } from 'src/utils/toastify'
import printerHost from 'src/apis/printerHost'
const BandWgtModel = ({ selectedBand }) => {
  //States
  const [backGround, setBackGround] = useState('')
  const [showButton, setShowButton] = useState(false)
  const { band, bandwgt } = selectedBand
  const [maxWgt, setMaxWgt] = useState(0)
  const [minWgt, setMinWgt] = useState(0)
  const [scaleReading, setScaleReading] = useState(0)

  //Redux-------------------------------------
  const tireDetail = useSelector((state) => state.tireDetails)
  const specDetail = useSelector((state) => state.specDetails)
  const scale = useSelector((state) => state.scaleData)

  const stabilityDetail = useSelector((state) => state.stabilityDetails)
  const dispatch = useDispatch()

  //useEffects-=----------------------
  useEffect(() => {
    setMaxWgt(getBandWgtTol(bandwgt) + parseFloat(bandwgt))
    setMinWgt(parseFloat(bandwgt) - getBandWgtTol(bandwgt))
  }, [bandwgt])
  //Scale Reading
  useEffect(() => {
    if (scale.reading !== undefined) {
      setScaleReading(scale.reading.reading.wgtReading)
    }
  }, [scale])
  useEffect(() => {
    if (scaleReading) {
      //Chcke for availablity
      const scaleReadingFloat = parseFloat(scaleReading) //Convert to Number

      if (scaleReadingFloat > 0.4) {
        // Check for weight is applyed

        if ((minWgt <= scaleReadingFloat) & (scaleReadingFloat <= maxWgt)) {
          console.log('ff')
          setBackGround('success')
          setShowButton(true)
        } else {
          setBackGround('danger')
          setShowButton(false)
        }
      } else {
        setBackGround('')
      }
    }
  }, [scaleReading])
  //Functions----------------------------------------
  const x = async () => {
    var currentdate = new Date()

    var datetime =
      currentdate.getDay() +
      '/' +
      (currentdate.getMonth() + 1) +
      `-- ` +
      currentdate.getHours() +
      ':' +
      currentdate.getMinutes()

    // Print the barcode
    const zpl = `^XA^FO150,1^BY2 ^BCN,120,Y,N,S^FD S${parseFloat(scaleReading).toFixed(
      2,
    )}L^FS^CF0,40^FO180,130^FD ${parseFloat(scaleReading).toFixed(2)} kg^FS
      ^FS^CF0,40^FO180,180^FD ${datetime}^FS

      ^FS^CF0,60^FO220,220^FD ${band}^FS
      ^XZ`
    const updateBarCode = await printerHost.put(`/bc`, { zpl, bcprinter: 1 })
    //Error in server
    if (updateBarCode.data.error) {
      return notifyError(updateBarCode.data.error + ' insert temp. barcode table')
    }
    //row count in inserted result is not equal to 1
    if (updateBarCode.data.data !== 1) {
      return notifyError('Not Inserted in temp barcode table')
    }
  }
  return (
    <Container>
      <Card bg={backGround} style={{ width: '25rem' }}>
        <Card.Header>
          <Card.Title>
            <h1 className="text-center">{band}</h1>
          </Card.Title>
        </Card.Header>
        <Card.Header>
          <Container>
            <Row>
              <Col>
                <h3>
                  <span className="badge bg-warning">{minWgt.toFixed(2)}</span>
                </h3>
              </Col>
              <Col>
                <h1>
                  <span className="badge bg-success">{parseFloat(scaleReading).toFixed(2)}</span>
                </h1>
              </Col>
              <Col>
                <h3>
                  <span className="badge bg-warning">{maxWgt.toFixed(2)}</span>
                </h3>
              </Col>
            </Row>
          </Container>
        </Card.Header>
        <Card.Body>
          <Col align="center">
            {showButton == true ? (
              <Button onClick={() => x()} className="btn-lg" variant="warning">
                Get Print Out
              </Button>
            ) : null}
          </Col>
        </Card.Body>
      </Card>
    </Container>
  )
}
BandWgtModel.propTypes = {
  selectedBand: PropTypes.object,
}
export default BandWgtModel
