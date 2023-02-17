import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { nanoid } from 'nanoid'
import { motion } from 'framer-motion'

import backBtn from '../assets/chevron-left-solid.svg'
import Member from './Member'
import '../sass/channel_info_nav.scss'
import cancelBtn from '../assets/xmark-solid.svg'
import User from './User'

interface NavBarProps {
  channelInfo: {
    channelName: string
    channelDesc: string
    channelMembers: [string, string][]
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

  return (
    <motion.div
      className={`channel-info-nav nav ${isNavOpen ? 'active' : ''}`}
      initial={{ opacity: '0' }}
      animate={{ opacity: '1' }}
      exit={{ opacity: '0' }}
    >
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
            <Member img={member[0]} name={member[1]} key={nanoid()} />
          ))}
        </div>
      </div>
      <User />
    </motion.div>
  )
}

export default ChannelInfoNav
