import PropTypes from 'prop-types'
import React from 'react'
import { Dropdown, DropdownButton } from 'react-bootstrap'

const DropDwnComp = ({ arr, selected, clickevent, dropDownName }) => {
  /*
Props Description
  arr: refined Array: two fields. 
  id: primary key form the database table
  value: value correspond to the primary key

  selected: Selected value from the drop down button. It will go to the title of the dropDownButton and display it.
            Triggerd with handler() method
            it is sent form main controller(PID Update component)

  clickevent:- passes id,value and dropDwonName to the main component
               
  dropDownName:- Name of the dropdown (passed by previous component). It will pass to the main component and 
                  based on the dropDownName click handler identyfy the clicking dropdown
                  tireSize,LugType,config,rimSize...
  */
  //drop down click event handler
  const handler = (id, value) => {
    clickevent(id, value, dropDownName)
  }
  //CSS for drop down list
  const css = {
    maxHeight: ' 300px',
    overflow: 'scroll',
    width: '100%',
    background: '#fff',
  }

  const css2 = {
    width: '100 %',
  }
  return (
    <div className="container-fluid">
      <DropdownButton
        id="dropdown-item-button container"
        title={selected}
        className="w-100"
        variant="warning"
      >
        <div className="panel-body" style={css}>
          {' '}
          {arr &&
            arr.map((size) => {
              const { id, value } = size
              return (
                <>
                  {/* Work as a button. Shows value sent from arr */}
                  <Dropdown.Item
                    onClick={() => handler(id, value)}
                    action
                    variant="primary"
                    className="list-group-item"
                  >
                    {value}
                  </Dropdown.Item>
                </>
              )
            })}
        </div>
      </DropdownButton>
    </div>
  )
}
DropDwnComp.propTypes = {
  arr: PropTypes.array,
  selected: PropTypes.string,
  clickevent: PropTypes.func,
  selectedDetailState: PropTypes.object,
  dropDownName: PropTypes.string,
}
export default DropDwnComp
