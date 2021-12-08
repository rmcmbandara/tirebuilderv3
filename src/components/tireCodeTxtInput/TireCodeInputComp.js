import React, { useState, useEffect } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'

//Redux
import { useDispatch, useSelector } from 'react-redux'
import { tireCodeTextChange } from '../../redux/tireCodeText/tireCodeTextActions'
import {
  setTireCodeDetail,
  resetTireDetails,
} from '../../redux/tireCodeDetail/tireCodeDetailsActions'
import { notifyError, notifyWarningQk } from 'src/utils/toastify'

const TireCodeInputComp = ({ inputRef }) => {
  //States-------------------------------------------------------------------
  const [tireCodeInput, setTireCodeInput] = useState('11444111')

  //Redux---------------------------------------------------------------------
  const dispatch = useDispatch()
  const tireDetail = useSelector((state) => state.tireDetails)
  const tireCodeDetail = useSelector((state) => state.tireCodeDetails)
  const tireCodeTxt = useSelector((state) => state.tireCodeText)

  //Functions----------------------------------------------------------------
  //TireCode input change handler
  const inputChangeHandler = (e) => {
    //replace non-digits with blank
    const value = e.target.value.replace(/[^\d]/, '')
    if (parseInt(value) !== 0) {
      setTireCodeInput(value)
    }
  }
  //UseEffects-------------------------------------------------------------

  //--UseEffect for tirecode text change dispatch the input

  useEffect(() => {
    dispatch(tireCodeTextChange(tireCodeInput))
  }, [tireCodeInput])

  //Check for tireCode Detail Availablility and if available search for Spec
  useEffect(() => {
    //Check for tirecode availability
    if (
      tireCodeDetail.data && //tireCodeDetail.data avaialbility
      !tireCodeDetail?.data?.data?.data[0] && //Now rows
      tireCodeTxt?.data?.length === 8 //Tire Code Equal to 8 no interger
    )
      //No tireCode
      return notifyWarningQk('Tire Code එකක් නොමැත')

    //TireCode is available
    if (tireCodeDetail?.data?.data?.data[0]) {
      //Find Specifications
    }
  }, [tireCodeDetail])

  //UseEffect for tireCodeText
  useEffect(() => {
    if (tireCodeTxt?.data?.length === 8) {
      dispatch(setTireCodeDetail(tireCodeInput.substring(0, 5)))
    } else {
      dispatch(setTireCodeDetail('000')) //Big not possible Number
    }
  }, [tireCodeTxt])
  return (
    <div>
      <Col xs={4}>
        <Form.Control
          ref={inputRef}
          size="lg"
          type="text"
          pattern="[0-9]*"
          placeholder="Tire Code..."
          onChange={(e) => inputChangeHandler(e)}
          value={tireCodeInput}
          maxLength="8"
        />
      </Col>
    </div>
  )
}
TireCodeInputComp.propTypes = {
  inputRef: PropTypes.object,
}
export default TireCodeInputComp
