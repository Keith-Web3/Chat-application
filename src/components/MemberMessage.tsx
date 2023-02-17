import React from 'react'

import '../sass/member_message.scss'

interface MemberMessageProp {
  img: string
  name: string
  date: string
  message: string
}

const MemberMessage: React.FC<MemberMessageProp> = function ({
  img,
  name,
  date,
  message,
}) {
  return (
    <div className="member-message">
      <img src={img} alt={name} />
      <p className="name">{name}</p>
      <p className="date">{date}</p>
      <p className="message">{message}</p>
    </div>
  )
}

export default MemberMessage
