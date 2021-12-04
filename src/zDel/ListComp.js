import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { ButtonGroup, Button, ListGroup, Row, Col, Container } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import SLTLDBConnection from '../apis/SLTLDBConnection'
import { notifyError } from 'src/utils/toastify'
import './ListComp.js'
const ListComp = ({ arr, name, clickevent }) => {
  const css = {
    maxHeight: ' 300px',
    maxWidth: '600px',
    margiBottom: '10px',
    overflow: 'scroll',
  }
  const handler = (id, value, name) => {
    clickevent(id, value, name)
  }
  return (
    <div className="panel panel-primary" id="result_panel">
      <link
        href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <div className="panel-heading">
        <h3 className="panel-title">{name}</h3>
      </div>
      <div className="panel-body" style={css}>
        <ul className="list-group">
          {arr &&
            arr.map((size) => {
              const { id, value } = size
              return (
                <>
                  <ListGroup.Item
                    onClick={() => handler(id, value, name)}
                    action
                    variant="primary"
                    className="list-group-item"
                  >
                    {value}
                  </ListGroup.Item>
                </>
              )
            })}
        </ul>
      </div>
    </div>
  )
}

ListComp.propTypes = {
  arr: PropTypes.array,
  name: PropTypes.string,
  clickevent: PropTypes.func,
}
export default ListComp
