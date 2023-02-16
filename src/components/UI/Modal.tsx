import React from 'react'

import Button from './Button'
import '../../sass/UI/modal.scss'

function Modal({ action, children, setShowModal }) {
  return (
    <div className="modal">
      <div className="backdrop"></div>
      <div className="container">
        <p>{children}</p>
        <Button onClick={action}>Continue</Button>
        <Button onClick={() => setShowModal(false)}>Back</Button>
      </div>
    </div>
  )
}

export default Modal
