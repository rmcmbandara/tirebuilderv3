import React, { useEffect, useRef, useState } from 'react'
import { Button, FormControl, InputGroup, Modal, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import SLTLDBConnection from 'src/apis/SLTLDBConnection'
import { scaleReading } from 'src/redux/scale/scaleActions'
import { getBandWgtTol } from 'src/utils/bandWgtTol'
import BandWgtModel, { bandWgtCard } from '../../components/bandStikerPrint/BandWgtCard'
import { PRINT_X, PRINT_Y } from 'src/utils/constants'
import printerHost from 'src/apis/printerHost'
import { notifyError } from 'src/utils/toastify'
import { pressNoArr } from 'src/utils/pressNos'
const PressStickerPrintView = () => {
  //UseStates
  const [value, setValue] = useState('p-')
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
  const x = async () => {
    const xy = pressNoArr

    const lowerCaseInclude = pressNoArr.includes(value.toLowerCase())
    const upperCaseInclude = pressNoArr.includes(value.toUpperCase())
    if (lowerCaseInclude || upperCaseInclude) {
      // Print the barcode
      let zpl = `^XA^FO${PRINT_X + 60},${PRINT_Y - 1}^BY2 ^BCN,120,Y,N,S^FD${value}^XZ`
      //zpl = `^XA^FO${PRINT_X + 60},${PRINT_Y - 1}^BY1 ^BCN,120,Y,N,S^FDS3.37L^XZ`
      const updateBarCode = await printerHost.put(`/bc`, { zpl, bcprinter: 1 })
      //Error in server
      if (updateBarCode.data.error) {
        return notifyError(updateBarCode.data.error + ' insert temp. barcode table')
      }
      //row count in inserted result is not equal to 1
      if (updateBarCode.data.data !== 1) {
        return notifyError('Not Inserted in temp barcode table')
      }
    } else {
      notifyError('Not a valid press no')
      setValue('p-')
    }
  }

  return (
    <>
      <Row>
        <hr />
        <InputGroup className="mb-3">
          <FormControl
            className="fs-1"
            placeholder="ප්‍රෙස්ස් නොම්බරය ටයිප් කරන්න"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength="5"
          />
        </InputGroup>
        <Button onClick={x}>Get PrintOut</Button>
      </Row>
    </>
  )
}

export default PressStickerPrintView
