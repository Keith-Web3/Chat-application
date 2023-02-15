import React, { MouseEvent } from 'react'
import { Outlet } from 'react-router-dom'
import { nanoid } from 'nanoid'

import '../sass/chat_interface.scss'
import DUMMY_DATA from './data/dummy'
import UserMessage from './UserMessage'
import sendBtn from '../assets/paper-plane-solid.svg'
import bars from '../assets/bars-solid.svg'

interface ChatInterfaceProps {
  channelInfo: {
    channelName: string
    channelDesc: string
    channelMembers: [string, string][]
  }
}

const handleNavToggle = function () {
  const nav = document.querySelector('.channel-info-nav')! as HTMLDivElement
  console.log('toggled')
  nav.classList.toggle('active')
}

const generalNavClose = function (e: MouseEvent<HTMLElement>) {
  if (
    !(e.target as HTMLElement)!.closest('.channel-info-nav') &&
    !(e.target as HTMLElement).matches('.menu') &&
    document.querySelector('.channel-info-nav')?.classList.contains('active')
  ) {
    handleNavToggle()
  }
}

const ChatInterface: React.FC<ChatInterfaceProps> = function ({ channelInfo }) {
  return (
    <main className="chat-interface" onClick={generalNavClose}>
      <Outlet />
      <section>
        <header className="header">
          <img
            src={bars}
            alt="menu"
            onClick={handleNavToggle}
            className="menu"
          />
          <p>{channelInfo.channelName}</p>
        </header>
        <div className="container">
          <div className="messages-container">
            {DUMMY_DATA.map(data => (
              <UserMessage key={nanoid()} {...data} />
            ))}
          </div>
          <label htmlFor="message" className="message-input">
            <input type="text" id="message" placeholder="Type a message here" />
            <button>
              <img src={sendBtn} alt="send" />
            </button>
          </label>
        </div>
      </section>
    </main>
  )
}

export default ChatInterface
