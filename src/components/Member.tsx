import React from 'react'

import '../sass/member.scss'
import userImg from '../assets/account_circle_FILL0_wght400_GRAD0_opsz48.svg'

interface MemberProps {
  img: string
  name: string
  email: string
}

const Member: React.FC<MemberProps> = function ({ img, name, email = '' }) {
  const editedName = name || email.slice(0, email.indexOf('@'))

  return (
    <div className="member">
      <img src={img || userImg} alt={editedName} />
      <p className={editedName}>{editedName}</p>
    </div>
  )
}

export default Member
