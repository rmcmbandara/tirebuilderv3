import React, { useState, useEffect } from 'react'
import SLTLDBConnection from '../../../apis/SLTLDBConnection'
import ListComp from '../../../zDel/ListComp'
import { notifyError } from '../../../utils/toastify'
import PropTypes from 'prop-types'
import Dropdown from '@restart/ui/esm/Dropdown'
import DropDwnComp from '../DropDwnComp'
const RimSizeLstCreator = ({ clickeventfrmMain, selectedDetailState }) => {
  //---->
  /*

  SelectedDetailState:-

   const [selectedDetailState, setSelectedDetailState] = useState({
    tireSize: 'Tire Size',
    lugType: 'Lug Type',
    config: 'Configuration',
    tireType: 'Tire Type',
    rimSize: 'Rim Size',
    swMsg: 'Side Wall',
    brandName: 'Brand',
    wheelColor: 'Wheel Color',
  })
  this will let know what item is selected. If not selected initial values are displayed
  
  clickeventfrmMain:-click hander. It needs id, value, and dropDownName)
  */

  const [data, setData] = useState([]) // state for store row data from http get reques
  const [refinedArr, setRefinedArr] = useState([]) //State for refined array. Refined data from "data" state.
  const [selected, setselected] = useState('') //Selected value from the drop down box

  //Click event for dropdown item click
  //values are discribed in "DropdownComp.js" file
  const clickevent = (id, value, dropDownName) => {
    clickeventfrmMain(id, value, dropDownName)
  }

  //fetching data from the table
  useEffect(() => {
    const fetchData = async () => {
      try {
        const info = await SLTLDBConnection.get(`/rimsize/getallrimsizes`) //---->
        //for valied sn only
        if (info.data) {
          setData(info.data.rows)
        } else {
        }
      } catch (err) {
        notifyError(err.message)
      }
    }
    fetchData()
  }, [])

  /*
selected:- onece selected detail state is changed selected is chanted.
It is sent to the DropDwnComp.js .
"selected" is the value shows in title of the dropdownbox
  */
  useEffect(() => {
    if (selectedDetailState) {
      setselected(selectedDetailState.rimSize) //---->
    }
  }, [selectedDetailState])

  //Create the arr. arr is sent to the
  useEffect(() => {
    if (data) {
      const x = data.map((value) => {
        const obj = {}
        obj.id = value.rimsizeid //---->
        obj.value = value.rimsize //---->
        return obj
      })
      setRefinedArr(x)
    }
  }, [data])

  return (
    <DropDwnComp
      arr={refinedArr}
      selected={selected}
      dropDownName={'rimSize'} //---->
      clickevent={clickevent}
    />
  )
}
RimSizeLstCreator.propTypes = {
  //--->
  //---->
  clickeventfrmMain: PropTypes.func,
  selectedDetailState: PropTypes.object,
}
export default RimSizeLstCreator //---->
