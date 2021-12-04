import React from 'react'
import PropTypes from 'prop-types'
const Component = ({ name, age }) => {
  return <div>In 5 years</div>
}

Component.propTypes = {
  name: PropTypes.string,
  age: PropTypes.number,
}
export default Component
