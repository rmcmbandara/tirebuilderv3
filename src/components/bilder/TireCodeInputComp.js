import React, { useState, useEffect } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { notifyError, notifyErrorQk, notifyWarningQk } from 'src/utils/toastify'
//Redux
import { useDispatch, useSelector } from 'react-redux'
import { tireCodeTextChange } from '../../redux/tireCodeText/tireCodeTextActions'
import {
  updateTireCodeAvl,
  updateSpecAvl,
  updateSpecVerMach,
} from '../../redux/dataAvl/dataAvlActions'
import {
  setTireCodeDetail,
  resetTireDetails,
} from '../../redux/tireCodeDetail/tireCodeDetailsActions'
import { getSpecDetail, resetSpec } from 'src/redux/spec/specActions'

const TireCodeInputComp = ({ inputRef, specVerMachHandler }) => {
  //States-------------------------------------------------------------------
  const [tireCodeInput, setTireCodeInput] = useState('1175411')
  const [showed, setshowed] = useState(false)

  //Redux---------------------------------------------------------------------
  const dispatch = useDispatch()
  const tireDetail = useSelector((state) => state.tireDetails)
  const tireCodeDetail = useSelector((state) => state.tireCodeDetails)
  const tireCodeTxt = useSelector((state) => state.tireCodeText)
  const specDetail = useSelector((state) => state.specDetails)
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
    ) {
      //No tireCode
      dispatch(updateTireCodeAvl(false)) //Send tireCodeAvl Detail to Perent
      return notifyWarningQk('Tire Code එකක් නොමැත')
    }
    //TireCode is available
    if (tireCodeDetail?.data?.data?.data[0]) {
      //Find tireCode and tire type id and dispach Spec Details
      var params = {
        tc: tireCodeDetail?.data?.data?.data[0]?.tirecode,
        ttid: tireCodeDetail?.data?.data?.data[0]?.tiretypeid,
      }
      dispatch(getSpecDetail(params))
      dispatch(updateTireCodeAvl(true)) //Send tireCodeAvl Detail to Perent
    }
  }, [tireCodeDetail])

  //UseEffect for input tireCodeText
  useEffect(() => {
    if (tireCodeTxt?.data?.length === 8) {
      dispatch(setTireCodeDetail(tireCodeInput.substring(0, 5)))
    } else {
      dispatch(setTireCodeDetail('000')) //Big not possible Number
      dispatch(resetSpec()) //Reset the spec
      setshowed(false) //Avoid double time showing toass of "Tire Code එකක් නොමත"
      dispatch(updateTireCodeAvl(false)) //Send tireCodeAvl Detail to Perent
    }
  }, [tireCodeTxt])

  //SpecDetail useEffect
  //Check for spec Availability
  useEffect(() => {
    //Check for Spe availability
    if (
      !specDetail?.data?.data &&
      tireCodeTxt?.data?.length === 8 &&
      !showed &&
      !specDetail.loading
    ) {
      /*No spec. Notify, 
      setShowed true because not to show notification two times. 
      Tirecode input put ""
      focus in input again
       */

      setshowed(true)
      inputRef?.current.focus()
      return notifyErrorQk(`spec නැත`)
    }

    //specVersion Matching and Spec Availability send to the peraent
    if (specDetail?.data?.data) {
      dispatch(updateSpecAvl(true)) //Send SpecAvl info to perent base on Spec Avilability

      //Get the spec Version of the tireCode
      var specVerInput = tireCodeInput.substr(tireCodeInput.length - 3)
      var specVerDB = specDetail?.data?.data?.spec?.specversion.toString()

      //Send specVerMach info to perent base on Spec Avilability
      if (specVerInput === specVerDB) {
        dispatch(updateSpecVerMach(true))
      } else {
        dispatch(updateSpecVerMach(false))
      }
    } else {
      dispatch(updateSpecAvl(false)) //Send SpecAvl info to perent base on Spec Avilability
      dispatch(updateSpecVerMach(false)) //Send specVerMach info to perent base on Spec Avilability
    }
  }, [specDetail])

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
//Methods---------------------------------------------------

TireCodeInputComp.propTypes = {
  inputRef: PropTypes.object,
  specAvlChangeHandler: PropTypes.func,
  tireCodeAvlChangeHandler: PropTypes.func,
  specVerMachHandler: PropTypes.func,
}
export default TireCodeInputComp
