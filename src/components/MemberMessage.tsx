import React from 'react'

import '../sass/member_message.scss'
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
  const img = userImg || imgU
  const name = userName || email.slice(0, email.indexOf('@'))
  let modifiedDate = new Date(date)
  const time = `${modifiedDate.getHours()}:${(
    '' + modifiedDate.getMinutes()
  ).padStart(2, '0')}`
  let day: string

  if (Date.now() - date > 86400000 && Date.now() - date < 2 * 8640000) {
    day = 'yesterday'
  } else if (Date.now() - date < 8640000) {
    day = 'today'
  } else {
    day = new Intl.DateTimeFormat('en-GB').format(modifiedDate)
  }
  return (
    <div className="member-message">
      <img src={img} alt={name} />
      <div className="header">
        <p className="name">{name}</p>
        <p className="date">{`${day}, ${time}`}</p>
      </div>
      <p className="message">{message}</p>
    </div>
  )
}

export default MemberMessage
