import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'

const CountDownTmer = () => {
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevCounter) => prevCounter + 1)
    }, 5000)

    return () => clearInterval(interval)
  }, [])
  return (
    <div>
      <h1>Counter: {counter}</h1>
    </div>
  )
}

export default CountDownTmer
