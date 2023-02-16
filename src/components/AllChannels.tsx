import React from 'react'
import { nanoid } from 'nanoid'
import { motion } from 'framer-motion'

import plus from '../assets/plus-solid.svg'
import searchIcon from '../assets/magnifying-glass-solid.svg'
import { channelNames } from './data/dummy'
import Channel from './Channel'
import '../sass/all_channels.scss'

const AllChannels: React.FC = function () {
  return (
    <motion.div
      className="all-channels nav"
      initial={{ opacity: '0' }}
      animate={{ opacity: '1' }}
      exit={{ opacity: '0' }}
    >
      <div className="header">
        <p>Channels</p>
        <div className="img-container">
          <img src={plus} alt="add channel" />
        </div>
      </div>
      <div className="container">
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
    </motion.div>
  )
}

export default AllChannels
