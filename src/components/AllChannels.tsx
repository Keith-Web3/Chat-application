import React, { useEffect, useState, useRef, FormEventHandler } from 'react'
import { nanoid } from 'nanoid'
import { collection, onSnapshot } from 'firebase/firestore'

import { database, auth } from './Data/firebase'
import plus from '../assets/plus-solid.svg'
import searchIcon from '../assets/magnifying-glass-solid.svg'
import Channel from './Channel'
import User from './User'
import closeBtn from '../assets/xmark-solid.svg'
import '../sass/all_channels.scss'

interface Props {
  setIsNavOpen: Function
  isNavOpen: boolean
  channelId: string
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

interface Channels {
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
}

const AllChannels: React.FC<Props> = function ({
  isNavOpen,
  channelId,
  setIsModalOpen,
  channelDispatch,
  setIsNavOpen,
}) {
  const [channels, setChannels] = useState<Channels[]>([])
  const [filteredChannels, setFilteredChannels] = useState(channels)
  const searchRef = useRef<HTMLInputElement>(null)

  const onChannelSearch: FormEventHandler<HTMLInputElement> = function (e) {
    setFilteredChannels(
      channels.filter(channel => {
        return channel.channelName
          .toLowerCase()
          .includes((e.target as HTMLInputElement)!.value.toLowerCase().trim())
      })
    )
  }

  useEffect(() => {
    ;(async () => {
      try {
        onSnapshot(collection(database, 'channels'), data => {
          let channels: any[] = []
          data.docs.forEach(item => {
            channels = [...channels, item.data()]
          })
          channels = channels.filter(
            el =>
              el.members.findIndex(
                (obj: any) => obj.id === auth.currentUser?.uid
              ) + 1
          )
          setChannels(channels)
          setFilteredChannels(
            channels.filter(channel => {
              return channel.channelName
                .toLowerCase()
                .includes(searchRef.current?.value.toLowerCase().trim() ?? '')
            })
          )
          setIsModalOpen(false)
        })
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
        <div className="close-btn" onClick={() => setIsNavOpen(false)}>
          <img src={closeBtn} alt="close" />
        </div>
      </div>
      <div className="container">
        <label htmlFor="search">
          <img src={searchIcon} alt="search" />
          <input
            type="text"
            id="search"
            name="search"
            ref={searchRef}
            onInput={onChannelSearch}
            placeholder="search"
            autoComplete="off"
          />
        </label>
        <div className="channels-container">
          {filteredChannels.map(
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
      <User channelId={channelId} channelDispatch={channelDispatch} />
    </div>
  )
}

export default AllChannels
