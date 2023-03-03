import React from 'react'
import { motion } from 'framer-motion'

import '../sass/member_message.scss'
import openai from '../assets/chatgpt-logo-02AFA704B5-seeklogo.com.png'
import imgU from '../assets/account_circle_FILL0_wght400_GRAD0_opsz48.svg'

interface MemberMessageProp {
  userImg: string
  userName: string
  date: number
  message: string
  email: string
}

const MemberMessage: React.FC<MemberMessageProp> = function ({
  userImg,
  userName,
  date,
  message,
  email,
}) {
  const img = userImg === 'openai' ? openai : userImg || imgU
  const name = userName || email.slice(0, email.indexOf('@'))
  let modifiedDate = new Date(date)
  const time = `${modifiedDate.getHours()}:${(
    '' + modifiedDate.getMinutes()
  ).padStart(2, '0')}`
  let day: string

  const tomorrowDate = new Date(date)
  tomorrowDate.setDate(tomorrowDate.getDate() + 1)

  if (
    new Intl.DateTimeFormat('en-GB').format(new Date()) ===
    new Intl.DateTimeFormat('en-GB').format(tomorrowDate)
  ) {
    day = 'yesterday'
  } else if (
    new Intl.DateTimeFormat('en-GB').format(new Date()) ===
    new Intl.DateTimeFormat('en-GB').format(modifiedDate)
  ) {
    day = 'today'
  } else {
    day = new Intl.DateTimeFormat('en-GB').format(modifiedDate)
  }
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="member-message"
    >
      <img
        src={img}
        alt={name}
        onError={e => {
          ;(e.target as HTMLImageElement).src = imgU
        }}
      />
      <div className="header">
        <p className="name">{name}</p>
        <p className="date">{`${day}, ${time}`}</p>
      </div>
      <p className="message">{message}</p>
    </motion.div>
  )
}

export default MemberMessage
