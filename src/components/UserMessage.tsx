import React from 'react'

import '../sass/user_message.scss'

interface userMessageProp {
  img: string
  name: string
  date: string
  message: string
}

const UserMessage: React.FC<userMessageProp> = function ({
  img,
  name,
  date,
  message,
}) {
  return (
    <div className="user-message">
      <img src={img} alt={name} />
      <p className="name">{name}</p>
      <p className="date">{date}</p>
      <p className="message">{message}</p>
    </div>
  )
}

export default UserMessage
