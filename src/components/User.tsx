import React from 'react'

import '../sass/user.scss'

interface UserProps {
  img: string
  name: string
}

const User: React.FC<UserProps> = function ({ img, name }) {
  return (
    <div className="user">
      <img src={img} alt={name} />
      <p className={name}>{name}</p>
    </div>
  )
}

export default User
