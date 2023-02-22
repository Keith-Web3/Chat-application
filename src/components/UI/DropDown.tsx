import React from 'react'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import copyImg from '../../assets/copy-solid.svg'
import logoutBtn from '../../assets/arrow-right-from-bracket-solid.svg'
import exitIcon from '../../assets/door-open-solid.svg'
import { auth } from '../Data/firebase'
import '../../sass/UI/drop-down.scss'

const DropDown: React.FC<{ channelId: string }> = function ({ channelId }) {
  const navigate = useNavigate()

  const signOutHandler = function () {
    signOut(auth)
    navigate('/signup')
  }

  return (
    <motion.div
      className="drop-down"
      initial={{ y: 'calc(-100% + 30px)', opacity: 0 }}
      animate={{ y: '-100%', opacity: 1 }}
      exit={{
        y: 'calc(-100% + 30px)',
        opacity: 0,
        transition: { type: 'tween', duration: 0.3 },
      }}
    >
      <div
        className="child copy-link"
        onClick={() => {
          navigator.clipboard.writeText(
            `https://astounding-choux-c5148e.netlify.app/join/:${channelId}`
          )
          alert('Invite link copied to clipboard!')
        }}
      >
        <p>Invite Link</p>
        <img src={copyImg} alt="copy" />
      </div>
      <div className="child exit-channel">
        <p>Exit channel</p>
        <img src={exitIcon} alt="exit channel" />
      </div>
      <div className="line"></div>
      <div className="child logout" onClick={signOutHandler}>
        <p>Logout</p>
        <img src={logoutBtn} alt="logout" />
      </div>
    </motion.div>
  )
}

export default DropDown
