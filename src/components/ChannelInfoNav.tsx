import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { nanoid } from 'nanoid'

import backBtn from '../assets/chevron-left-solid.svg'
import Member from './Member'
import '../sass/channel_info_nav.scss'
import cancelBtn from '../assets/xmark-solid.svg'
import User from './User'

interface NavBarProps {
  channelInfo: {
    channelName: string
    channelDesc: string
    channelMembers: {
      id: string
      photoURL: string
      name: string
      email: string
    }[]
  }
  isNavOpen: boolean
}

const handleNavToggle = function () {
  const nav = document.querySelector('.nav')! as HTMLDivElement

  nav.classList.toggle('active')
}

const ChannelInfoNav: React.FC<NavBarProps> = function ({
  channelInfo,
  isNavOpen,
}) {
  const params = useParams()
  const navigate = useNavigate()
  console.log(channelInfo)

  return (
    <div className={`channel-info-nav nav ${isNavOpen ? 'active' : ''}`}>
      <div className="header">
        <img src={backBtn} alt="back" onClick={() => navigate('/channels')} />
        <p>All Channels</p>
        <div className="img-container">
          <img src={cancelBtn} alt="cancel" />
        </div>
      </div>
      <div className="container">
        <p className="name">{channelInfo.channelName}</p>
        <p className="desc">{channelInfo.channelDesc}</p>
        <div className="members">
          <p>Members</p>
          {channelInfo.channelMembers.map(member => (
            <Member
              img={member.photoURL}
              name={member.name}
              email={member.email}
              key={nanoid()}
            />
          ))}
        </div>
      </div>
      <User />
    </div>
  )
}

export default ChannelInfoNav
