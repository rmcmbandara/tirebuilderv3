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
  const [value, setValue] = useState('200102222')
  const dispatch = useDispatch()
  const [data, setData] = useState()

  const printSticker = async () => {
    if (value.length == 9) {
      console.log(value)
    }
    const lowerCaseInclude = pressNoArr.includes(value.toLowerCase())
    const upperCaseInclude = pressNoArr.includes(value.toUpperCase())
    if (lowerCaseInclude || upperCaseInclude) {
      // Print the barcode
      let zpl = `^XA^FO${PRINT_X + 60},${PRINT_Y - 1}^BY2 ^BCN,120,Y,N,S^FDS${value}L^XZ`
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
      notifyError('Not a valid press nos')
      setValue('p-')
    }
  }

  const printSticker2 = () => {
    SLTLDBConnection.get(`stk/getallpiddetail/${value}`)
      .then((res) => {
        if (res.data.data.rowCount != 0) {
          console.log(res?.data?.data.rows[0])
        } else {
          console.log('SN Not avl')
        }
      })
      .catch((e) => console.log(e.message))
  }
  useEffect(() => {
    if (value.length == 9) {
      printSticker2()
    }
  }, [value.length])
  return (
    <>
      <Row>
        <hr />
        <InputGroup className="mb-3">
          <FormControl
            className="fs-1"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength="9"
          />
        </InputGroup>
      </Row>
    </>
  )
}

export default PressStickerPrintView
