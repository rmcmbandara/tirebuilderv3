import React, { useEffect, useRef, useState } from 'react'
import { FormControl, InputGroup, Modal, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import SLTLDBConnection from 'src/apis/SLTLDBConnection'
import { scaleReading } from 'src/redux/scale/scaleActions'
import { getBandWgtTol } from 'src/utils/bandWgtTol'
import BandWgtModel, { bandWgtCard } from '../../components/bandStikerPrint/BandWgtCard'
const BandSticerPrintView = () => {
  //UseStates
  const [value, setValue] = useState('')
  const [bandDetails, setBandDetails] = useState([])
  const [bandLower, setBandLower] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [showModelStte, setShowModelStte] = useState(true)
  const [selectedBand, setSelectedBand] = useState({
    band: '',
    bandWgt: 0,
    maxWgt: 0,
    minWgt: 0,
  })
  const [isOpen, setIsOpen] = React.useState(false)
  const inputRef = useRef()
  //Redux
  const dispatch = useDispatch()
  //Scale Reading------------------------------------------------------------------
  const scale = useSelector((state) => state.scaleData)
  var { reading } = scale
  //Fetch from localhost:4000/sc  and store in redux store with timer
  useEffect(() => {
    //Initialize
    const sto = { reading: 0, time: Date.now() }
    localStorage.setItem('cr', JSON.stringify(sto))
    const timer = setInterval(async () => {
      //codes are executed every 200ms
      dispatch(scaleReading())
    }, 200)
    return () => {
      clearInterval(timer)
    }
  }, [])
  //Fetch Band data from DB

  useEffect(() => {
    fetchDataSN()
  }, [])
  //getFilterdSn List
  const fetchDataSN = async () => {
    try {
      const response = await SLTLDBConnection.get(`band/getBandDetails`)
      setBandDetails(response.data.rows)
    } catch (err) {
      console.error(err.message)
    }
  }
  //Convert to lovercase
  useEffect(() => {
    setBandLower(lower(bandDetails))
  }, [bandDetails])
  //ShwoModel
  useEffect(() => {
    selectedBand.band && setIsOpen(true)
  }, [selectedBand])

  //Functions-------------------------------------
  const hideModal = () => {
    setSelectedBand({})
    setIsOpen(false)
  }
  //Convert to lower case
  function lower(obj) {
    for (var prop in obj) {
      if (typeof obj[prop] === 'string') {
        obj[prop] = obj[prop].toLowerCase()
      }
      if (typeof obj[prop] === 'object') {
        lower(obj[prop])
      }
    }
    return obj
  }
  return (
    <>
      <Row>
        <hr />
        <InputGroup className="mb-3">
          <FormControl
            placeholder="බැන්ඩ් සයිස් එක එන්ටර් කරන්න....."
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </InputGroup>
      </Row>
      <Row>
        <div classNa="col-6">
          <table className="table-responsive{-sm-md|-lg|-xl} table mt-2 text-left table-hover table-sm">
            <thead>
              <tr>
                <th className="text-primary">band</th>
                <th className="text-primary">bandwgt</th>
              </tr>
            </thead>
          </table>
        </div>
      </Row>
      <Row>
        <div classNa="col-6">
          <table className="table-responsive{-sm-md|-lg|-xl} table mt-2 text-left table-hover table-sm">
            <tbody>
              {bandLower &&
                bandLower
                  .filter((item) => {
                    if (!value) return true
                    if (item.band.includes(value) || item.band.includes(value)) {
                      return true
                    }
                  })
                  .map((el) => (
                    <tr key={el} onClick={(e) => setSelectedBand(el)}>
                      <td>
                        <h6>{el.band}</h6>
                      </td>
                      <td>{parseFloat(el.bandwgt).toFixed(2)}</td>
                      <td>{(getBandWgtTol(el.bandwgt) + parseFloat(el.bandwgt)).toFixed(2)}</td>
                      <td>{(parseFloat(el.bandwgt) - getBandWgtTol(el.bandwgt)).toFixed(2)}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </Row>
      <Modal show={isOpen} onHide={hideModal} centered>
        <Modal.Body>
          <BandWgtModel selectedBand={selectedBand} />
        </Modal.Body>
      </Modal>
    </>
  )
}

export default BandSticerPrintView
