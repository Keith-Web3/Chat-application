import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { createChannel } from '../Utils/chatFunctions'

import '../../sass/UI/modal.scss'
import Button from './Button'

const Modal: React.FC<{ setIsModalOpen: Function }> = function ({
  setIsModalOpen,
}) {
  const closeModalHandler = function (this: HTMLDivElement, e: MouseEvent) {
    if (!(e.target! as Element).closest('.container')) setIsModalOpen(false)
  }
  const channelNameRef = useRef<HTMLInputElement>(null)
  const channelDescRef = useRef<HTMLTextAreaElement>(null)

  const root = document.getElementById('modal-root')! as HTMLDivElement
  root.addEventListener('click', closeModalHandler)

  return (
    <motion.div
      className="modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        className="container"
        initial={{ scale: 0 }}
        animate={{
          scale: 1,
          transition: {
            type: 'spring',
            damping: 25,
            stiffness: 500,
            duration: 0.4,
          },
        }}
      >
        <h2>New Channel</h2>
        <input type="text" placeholder="Channel name" ref={channelNameRef} />
        <textarea placeholder="Channel Description" ref={channelDescRef} />
        <Button
          onClick={() =>
            createChannel(
              channelNameRef.current!.value,
              channelDescRef.current!.value
            )
          }
        >
          Save
        </Button>
      </motion.div>
    </motion.div>
  )
}

export default Modal
