import React, { MouseEvent, useRef, useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Outlet, useLocation } from 'react-router-dom'
import { nanoid } from 'nanoid'
import { onSnapshot, collection } from 'firebase/firestore'

import { sendMessage } from './Utils/chatFunctions'
import '../sass/chat_interface.scss'
import DUMMY_DATA from './Data/dummy'
import MemberMessage from './MemberMessage'
import sendBtn from '../assets/paper-plane-solid.svg'
import bars from '../assets/bars-solid.svg'
import Modal from './UI/Modal'
import copyImg from '../assets/copy-solid.svg'
import { database } from './Data/firebase'

interface ChatInterfaceProps {
  channelInfo: {
    channelName: string
    channelDesc: string
    channelId: string
    channelMembers: {
      id: string
      photoURL: string
      name: string
      email: string
    }[]
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
  console.log(channelInfo)
  const handleNavToggle = function () {
    setIsNavOpen((prev: boolean) => !prev)
  }
  const location = useLocation()
  const messageRef = useRef<HTMLInputElement>(null)
  const [allMessages, setAllMessages] = useState<
    {
      date: number
      message: string
      userImg: string
      userName: string
      email: string
    }[]
  >([{ date: 0, message: '', userImg: '', userName: '', email: '' }])

  useEffect(() => {
    onSnapshot(collection(database, 'channels'), data => {
      let messages: {
        date: number
        message: string
        userImg: string
        userName: string
        email: string
      }[] = []
      data.docs.forEach(item => {
        if (item.data().id === channelInfo.channelId) {
          messages = item.data().messages
        }
      })
      setAllMessages(messages)
      console.log(messages)
      messageRef.current!.value = ''
    })
  }, [channelInfo.channelId])

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
          <div
            className="copy-link"
            onClick={() => navigator.clipboard.writeText(location.pathname)}
          >
            <p>Invite Link</p>
            <img src={copyImg} alt="copy" />
          </div>
        </header>
        <div className="container">
          <div className="messages-container">
            {allMessages.map(data => (
              <MemberMessage key={nanoid()} {...data} />
            ))}
          </div>
          <label htmlFor="message" className="message-input">
            <input
              type="text"
              id="message"
              placeholder="Type a message here"
              ref={messageRef}
            />
            <button
              onClick={() =>
                sendMessage(messageRef.current!.value, channelInfo.channelId)
              }
            >
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
