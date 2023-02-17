import React from 'react'

import '../sass/member.scss'

interface MemberProps {
  img: string
  name: string
}

const Member: React.FC<MemberProps> = function ({ img, name }) {
  return (
    <div className="member">
      <img src={img} alt={name} />
      <p className={name}>{name}</p>
    </div>
  )
}

export default Member
