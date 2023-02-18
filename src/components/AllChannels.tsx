import React, { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'
import { collection, getDocs } from 'firebase/firestore'

import plus from '../assets/plus-solid.svg'
import searchIcon from '../assets/magnifying-glass-solid.svg'
import Channel from './Channel'
import '../sass/all_channels.scss'
import User from './User'
import { database, auth } from './Data/firebase'

interface Props {
  isNavOpen: boolean
  setIsModalOpen: Function
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

const AllChannels: React.FC<Props> = function ({
  isNavOpen,
  setIsModalOpen,
  channelDispatch,
}) {
  const [channels, setChannels] = useState<{ [props: string]: any }>([])

  useEffect(() => {
    ;(async () => {
      try {
        const querySnapShot = await getDocs(collection(database, 'channels'))
        let channels: any[] = []
        querySnapShot.forEach(doc => {
          channels = [...channels, doc.data()]
        })
        channels = channels.filter(
          el =>
            el.members.findIndex(
              (obj: any) => obj.id === auth.currentUser?.uid
            ) + 1
        )
        setChannels(channels)
        console.log(channels)
      } catch (err) {
        console.log(err)
      }
    })()
  }, [])

  return (
    <div className={`all-channels nav ${isNavOpen ? 'active' : ''}`}>
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
          {channels.map(
            (el: {
              channelName: string
              channelDescription: string
              id: string
              members: {
                id: string
                photoURL: string
                name: string
                email: string
              }[]
              messages: any[]
            }) => {
              const clickChannelHandler = function () {
                channelDispatch({
                  type: 'dispatchChannelInfo',
                  payload: {
                    channelName: el.channelName,
                    channelDesc: el.channelDescription,
                    channelMembers: el.members,
                    channelMessages: el.messages,
                    channelId: el.id,
                  },
                })
              }
              return (
                <Channel
                  name={el.channelName}
                  key={nanoid()}
                  onClick={clickChannelHandler}
                />
              )
            }
          )}
        </div>
      </div>
      <User />
    </div>
  )
}

export default AllChannels
