import React from 'react'
import { nanoid } from 'nanoid'

import plus from '../assets/plus-solid.svg'
import searchIcon from '../assets/magnifying-glass-solid.svg'
import { channelNames } from './data/dummy'
import Channel from './Channel'

const AllChannels: React.FC = function () {
  return (
    <div className="all-channels">
      <div className="header">
        <p>Channels</p>
        <img src={plus} alt="add channel" />
      </div>
      <label htmlFor="search">
        <img src={searchIcon} alt="search" />
        <input type="text" id="search" name="search" placeholder="search" />
      </label>
      <div className="channels-container">
        {channelNames.map(el => (
          <Channel name={el} key={nanoid()} />
        ))}
      </div>
    </div>
  )
}

export default AllChannels
