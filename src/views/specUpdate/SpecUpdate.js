import React, { useState, useEffect } from 'react'
import { Button, Col, Dropdown, DropdownButton, Form, Row, Stack } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import SLTLDBConnection from '../../../src/apis/SLTLDBConnection'
import { notifyError } from 'src/utils/toastify'
import { getPidDetail } from '../pidUpdate/httpRequests/pidDetailforPid'
const SpecUpdate = () => {
  const [pidLst, setPidLst] = useState([])
  const [counter, setCounter] = useState(0)
  const [lst, setLst] = useState([])
  const [isLoading, setLoading] = useState(true)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const info = await SLTLDBConnection.get(`/pid/allpiddetailall`, { timeout: 1500000 })
        if (info.data) {
          setPidLst(info.data)
        }
      } catch (err) {
        notifyError(err.message)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (pidLst.length > 0) {
      console.log(pidLst)
    }
  }, [pidLst])

  return (
    <div className="wrapper">
      <h1>My Grocery List</h1>
      <ul></ul>
    </div>
  )
}
export default SpecUpdate
