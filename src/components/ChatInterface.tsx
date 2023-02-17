import React, { MouseEvent, useState } from 'react'
import ReactDOM from 'react-dom'
import { Outlet } from 'react-router-dom'
import { nanoid } from 'nanoid'

import '../sass/chat_interface.scss'
import DUMMY_DATA from './Data/dummy'
import MemberMessage from './MemberMessage'
import sendBtn from '../assets/paper-plane-solid.svg'
import bars from '../assets/bars-solid.svg'
import Modal from './UI/Modal'

interface ChatInterfaceProps {
  channelInfo: {
    channelName: string
    channelDesc: string
    channelMembers: [string, string][]
  }
  isModalOpen: boolean
  setIsNavOpen: Function
  setIsModalOpen: Function
}

const ChatInterface: React.FC<ChatInterfaceProps> = function ({
  channelInfo,
  isModalOpen,
  setIsNavOpen,
  setIsModalOpen,
}) {
  const handleNavToggle = function () {
    setIsNavOpen((prev: boolean) => !prev)
  }

  const generalNavClose = function (e: MouseEvent<HTMLElement>) {
    if (
      !(e.target as HTMLElement)!.closest('.nav') &&
      !(e.target as HTMLElement).matches('.menu') &&
      document.querySelector('.nav')?.classList.contains('active')
    ) {
      handleNavToggle()
    }
  }

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
              <MemberMessage key={nanoid()} {...data} />
            ))}
          </div>
          <label htmlFor="message" className="message-input">
            <input type="text" id="message" placeholder="Type a message here" />
            <button>
              <img src={sendBtn} alt="send" />
            </button>
          </label>
        </div>
        {ReactDOM.createPortal(
          isModalOpen && <Modal setIsModalOpen={setIsModalOpen} />,
          document.getElementById('modal-root') as Element
        )}
      </section>
    </main>
  )
}

export default ChatInterface
