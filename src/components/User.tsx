import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { nanoid } from 'nanoid'

import userImg from '../assets/account_circle_FILL0_wght400_GRAD0_opsz48.svg'
import downArrow from '../assets/angle-down-solid.svg'
import '../sass/user.scss'
import DropDown from './UI/DropDown'

const User: React.FC<{ channelId: string }> = function ({ channelId }) {
  const user = useSelector(
    (state: { user: any; isLoggedIn: boolean }) => state.user
  )
  const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false)

  const name = user.displayName || user.email.slice(0, user.email.indexOf('@'))
  const profileImg = user.photoURL || userImg

  document.body.addEventListener('click', (e: MouseEvent) => {
    if (
      !(
        (e.target as HTMLElement)!.closest('.down') ||
        (e.target as HTMLElement)!.closest('.drop-down')
      )
    )
      setIsDropDownOpen(false)
  })

  return (
    <div className="user">
      <img src={profileImg} alt="profile" />
      <p className="name">{name}</p>
      <motion.img
        className="down"
        onClick={() => {
          setIsDropDownOpen(prev => !prev)
        }}
        src={downArrow}
        alt="open"
        animate={{ rotate: isDropDownOpen ? '180deg' : '0' }}
      />
      <AnimatePresence>
        {isDropDownOpen && <DropDown key={nanoid()} channelId={channelId} />}
      </AnimatePresence>
    </div>
  )
}

export default User
