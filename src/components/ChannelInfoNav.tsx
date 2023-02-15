import React, { MouseEvent } from 'react'
import { useParams } from 'react-router-dom'
import { nanoid } from 'nanoid'

import backBtn from '../assets/chevron-left-solid.svg'
import User from './User'
import '../sass/channel_info_nav.scss'

interface NavBarProps {
  channelInfo: {
    channelName: string
    channelDesc: string
    channelMembers: [string, string][]
  }
}

const handleNavToggle = function () {
  const nav = document.querySelector('.channel-info-nav')! as HTMLDivElement

  nav.classList.toggle('active')
}
// const generalNavClose = function (e: MouseEvent<HTMLBodyElement>) {
//   if (!(e.target as HTMLElement)!.closest('.channel-info-nav'))
//     handleNavToggle()
// }
// document.body.addEventListener('click', generalNavClose)

const ChannelInfoNav: React.FC<NavBarProps> = function ({ channelInfo }) {
  const params = useParams()

  console.log(params)
  return (
    <div className="channel-info-nav">
      <div className="header">
        <img src={backBtn} alt="back" onClick={handleNavToggle} />
        <p>All Channels</p>
      </div>
      <div className="container">
        <p className="name">{channelInfo.channelName}</p>
        <p className="desc">{channelInfo.channelDesc}</p>
        <div className="members">
          <p>Members</p>
          {channelInfo.channelMembers.map(member => (
            <User img={member[0]} name={member[1]} key={nanoid()} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChannelInfoNav
