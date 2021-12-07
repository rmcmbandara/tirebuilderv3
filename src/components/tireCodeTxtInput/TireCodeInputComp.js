import React from 'react'
import { Form } from 'react-bootstrap'

const TireCodeInputComp = () => {
  return (
    <div>
      <>
        <Form.Label htmlFor="exampleColorInput">Color picker</Form.Label>
        <Form.Control
          type="color"
          id="exampleColorInput"
          defaultValue="#563d7c"
          title="Choose your color"
        />
      </>
    </div>
  )
}

export default TireCodeInputComp
