import React from 'react'
import { useNavigate } from 'react-router-dom'
import { nanoid } from 'nanoid'

import backBtn from '../assets/chevron-left-solid.svg'
import Member from './Member'
import '../sass/channel_info_nav.scss'
import cancelBtn from '../assets/xmark-solid.svg'
import User from './User'

interface NavBarProps {
  setIsNavOpen: Function
  channelInfo: {
    channelName: string
    channelDesc: string
    channelId: string
    isPrivate?: boolean
    channelMembers: {
      id: string
      photoURL: string
      name: string
      email: string
    }[]
    channelMessages: any[]
  }
  isNavOpen: boolean
  channelDispatch: React.Dispatch<{
    type: string
    payload: {
      channelName: string
      channelDesc: string
      channelId: string
      channelMembers: {
        id: string
        photoURL: string
        name: string
        email: string
      }[]
      channelMessages: any[]
    }
  }>
}

const ChannelInfoNav: React.FC<NavBarProps> = function ({
  channelInfo,
  isNavOpen,
  channelDispatch,
  setIsNavOpen,
}) {
  const navigate = useNavigate()

  return (
    <div className={`channel-info-nav nav ${isNavOpen ? 'active' : ''}`}>
      <div className="header">
        <img src={backBtn} alt="back" onClick={() => navigate('/channels')} />
        <p>All Channels</p>
        <div className="close-btn" onClick={() => setIsNavOpen(false)}>
          <img src={cancelBtn} alt="close" />
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
              id={member.id}
              isPrivate={channelInfo.isPrivate}
              channelDispatch={channelDispatch}
              key={nanoid()}
            />
          ))}
        </div>
      </div>
      <User channelInfo={channelInfo} channelDispatch={channelDispatch} />
    </div>
  )
}

export default ChannelInfoNav
