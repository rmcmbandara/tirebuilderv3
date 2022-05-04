import React, { useState, useEffect, useCallback } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { notifyError, notifyErrorQk, notifySuccessQk, notifyWarningQk } from 'src/utils/toastify'
//Redux
import { useDispatch, useSelector } from 'react-redux'
import { tireCodeTextChange } from '../../redux/tireCodeText/tireCodeTextActions'
import {
  updateTireCodeAvl,
  updateSpecAvl,
  updateSpecVerMach,
} from '../../redux/dataAvl/dataAvlActions'
import { setSpecBandWgt } from '../../redux/band/bandActions'
import { setTireCodeDetail } from '../../redux/tireCodeDetail/tireCodeDetailsActions'
import { getSpecDetail, resetSpec } from 'src/redux/spec/specActions'
import { setSettingWgt, setMaxTol, setMinTol } from '../../redux/scalStability/stabilityActions'
import { toggleSrtPob } from 'src/redux/srtpob/srtpobActions'
import { Button } from 'react-bootstrap'
const TireCodeInputComp = ({
  disableInputTireCode,
  inputRef,
  tireCodeInput,
  onTireCodeBarCodeChange,
  showPressEnterRemotely,
}) => {
  //States-------------------------------------------------------------------
  const [showed, setshowed] = useState(false)

  //Redux---------------------------------------------------------------------
  const dispatch = useDispatch()
  const tireDetail = useSelector((state) => state.tireDetails)
  const tireCodeDetail = useSelector((state) => state.tireCodeDetails)
  const tireCodeTxt = useSelector((state) => state.tireCodeText)
  const specDetail = useSelector((state) => state.specDetails)
  //Functions----------------------------------------------------------------
  //TireCode input change handler

  const handleInputChange = useCallback(
    (event) => {
      onTireCodeBarCodeChange(event.target.value)
    },
    [onTireCodeBarCodeChange],
  )

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
      //Hide PressNo Enter model
      showPressEnterRemotely(false)
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
      // band wgt spec
      //Get Band Detail
      const bandwgtSpec = tireCodeDetail?.data?.data?.data[0]?.bandwgt
      if (bandwgtSpec) {
        dispatch(setSpecBandWgt(bandwgtSpec))
      }
    }
  }, [tireCodeDetail])

  return (
    <>
      <Col xs={8}>
        <Form.Control
          ref={inputRef}
          size="lg"
          type="text"
          pattern="[0-9]*"
          placeholder="Tire Code..."
          onChange={(e) => handleInputChange(e)}
          value={tireCodeInput}
          maxLength="8"
          disabled={disableInputTireCode}
        />
      </Col>
    </>
  )
}
//Methods---------------------------------------------------

TireCodeInputComp.propTypes = {
  inputRef: PropTypes.object,
  specAvlChangeHandler: PropTypes.func,
  tireCodeAvlChangeHandler: PropTypes.func,
  tireCodeInput: PropTypes.number,
  onTireCodeBarCodeChange: PropTypes.func,
  disableInputTireCode: PropTypes.bool,
  onBandBarcodeChange: PropTypes.func,
  showPressEnterRemotely: PropTypes.func,
}
export default TireCodeInputComp
