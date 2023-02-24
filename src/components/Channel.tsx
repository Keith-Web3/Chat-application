import React from 'react'
import { useNavigate } from 'react-router-dom'

import '../sass/channel.scss'

const Channel: React.FC<{
  name: string
  onClick: Function
}> = function ({ name, onClick }) {
  const navigate = useNavigate()

  const abbreviatedName = name
    .split(' ')
    .map(el => el[0]?.toUpperCase())
    .join('')
    .slice(0, 2)

  return (
    <div
      className="channel"
      onClick={() => {
        onClick()
        navigate(`/:${name}`)
      }}
    >
      <p className="logo">{abbreviatedName}</p>
      <p className="name">{name}</p>
    </div>
  )
}

export default Channel
