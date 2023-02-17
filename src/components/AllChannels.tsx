import React from 'react'
import { nanoid } from 'nanoid'
import { motion } from 'framer-motion'

import plus from '../assets/plus-solid.svg'
import searchIcon from '../assets/magnifying-glass-solid.svg'
import { channelNames } from './Data/dummy'
import Channel from './Channel'
import '../sass/all_channels.scss'
import User from './User'

interface Props {
  isNavOpen: boolean
  setIsModalOpen: Function
}

const AllChannels: React.FC<Props> = function ({ isNavOpen, setIsModalOpen }) {
  return (
    <motion.div
      className={`all-channels nav ${isNavOpen ? 'active' : ''}`}
      initial={{ opacity: '0' }}
      animate={{ opacity: '1' }}
      exit={{ opacity: '0' }}
    >
      <div className="header">
        <p>Channels</p>
        <div className="img-container" onClick={() => setIsModalOpen(true)}>
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
      <User />
    </motion.div>
  )
}

export default AllChannels
