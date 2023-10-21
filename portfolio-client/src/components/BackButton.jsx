import React from 'react'
import {CaretLeftFill} from 'react-bootstrap-icons'
import './Buttons.css'

const BackButton = () => {
  return (
    <div>
        <button className="back-button">
            <CaretLeftFill/>
            <p>Back</p>
        </button>
    </div>
  )
}

export default BackButton