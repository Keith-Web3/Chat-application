import React, { MouseEvent, useState } from 'react'

import '../../sass/UI/modal.scss'
import Button from './Button'

const Modal: React.FC<{ setIsModalOpen: Function }> = function ({
  setIsModalOpen,
}) {
  const closeModalHandler = function (e: MouseEvent<HTMLDivElement>) {
    if (!(e.target! as Element).closest('.container')) setIsModalOpen(false)
  }

  const root = document.getElementById('modal-root') as HTMLDivElement
  root.addEventListener('click', closeModalHandler)

  return (
    <div className="modal">
      <div className="container">
        <h2>New Channel</h2>
        <input type="text" placeholder="Channel name" />
        <textarea placeholder="Channel Description" />
        <Button>Save</Button>
      </div>
    </div>
  )
}

export default Modal
