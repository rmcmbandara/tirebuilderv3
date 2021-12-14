import React, { useEffect, useState } from 'react'
import { Button, Card } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import SLTLDBConnection from 'src/apis/SLTLDBConnection'
import { getSpecDetailsList } from 'src/utils/specDetailCreator'

const TtlWgtDisplayComp = () => {
  //States--------------------------------------------
  const [specDetailObj, setSpecDetailObj] = useState({})
  const [bandWgtDisplay, setBandWgtDisplay] = useState('0')
  const [ttlWgt, setTtlWgt] = useState(0)
  //Redux Selectors-------------------------------------
  const specDetail = useSelector((state) => state.specDetails)
  const tireCodeDetail = useSelector((state) => state.tireCodeDetails)
  const dataAvl = useSelector((state) => state.dataAvlReducer)
  const tireCodeTxt = useSelector((state) => state.tireCodeText)
  //Get the Band Details
  const bandwgt = tireCodeDetail?.data?.data?.data[0]?.bandwgt

  //Variable Decalrations
  const [lst, setLst] = useState([]) //Compound Detail List

  const specAvl = dataAvl?.specAvl
  //SpecDetail useEffect
  //Check for spec Availability and if avl get the comp and wgts as an array
  useEffect(() => {
    setLst(getSpecDetailsList())
  }, [specDetail])

  //usee Effect for lst change
  //Calculate total Wgt
  useEffect(() => {
    if (lst?.length > 0 && lst) {
      const sumall =
        lst && lst.map((item) => parseFloat(item.wgt)).reduce((prev, curr) => prev + curr, 0)
      const x = parseFloat(bandwgt) + sumall
      setTtlWgt(x)
    }
  }, [lst])

  //Click Handler

  const clickHandler = () => {
    console.log('clciked')
  }

  return (
    <Card style={{ minWidth: '400px' }}>
      <Card.Header as="h5">Total Wgt</Card.Header>
      <Card.Body>
        <div className="col text-center">
          <Card.Title style={{ fontSize: '50px' }}>{ttlWgt.toFixed(2)}</Card.Title>
        </div>
        <div className="col text-center mt-5">
          <Button
            className="btn btn-default fs-1 mx-auto "
            style={{ minWidth: '300px', minHeight: '100px', marginRight: 0 }}
            onClick={clickHandler}
          >
            ENTER
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}

export default TtlWgtDisplayComp
