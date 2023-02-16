import React from 'react'
import { motion } from 'framer-motion'

import '../../sass/UI/popup.scss'

const errorVariant = {
  hidden: {
    x: '100vw',
  },
  visible: {
    x: 0,
    transition: {
      when: 'beforeChildren',
    },
  },
  exit: {
    x: '100vw',
  },
}
const timerVariant = {
  visible: {
    width: 0,
    transition: {
      duration: 3,
    },
  },
}

function Popup({ message }) {
  return (
    <motion.div
      className="popup"
      variants={errorVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <p>{message}</p>
      <motion.div className="progress" variants={timerVariant}></motion.div>
    </motion.div>
  )
}

export default Popup
