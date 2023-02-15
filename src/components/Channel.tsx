import React from 'react'

const Channel: React.FC<{ name: string }> = function ({ name }) {
  const abbreviatedName = name
    .split(' ')
    .map(el => el[0].toUpperCase())
    .join('')
    .slice(0, 2)

  return (
    <div className="channel">
      <p className="logo">{abbreviatedName}</p>
      <p>{name}</p>
    </div>
  )
}

export default Channel
