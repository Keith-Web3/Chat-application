import React, {
  MouseEvent,
  useRef,
  useState,
  useEffect,
  KeyboardEventHandler,
} from 'react'
import ReactDOM from 'react-dom'
import { Outlet } from 'react-router-dom'
import { onSnapshot, collection } from 'firebase/firestore'

import { sendMessage } from './Utils/chatFunctions'
import '../sass/chat_interface.scss'
import MemberMessage from './MemberMessage'
import sendBtn from '../assets/paper-plane-solid.svg'
import bars from '../assets/bars-solid.svg'
import Modal from './UI/Modal'
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
    channelMessages: any[]
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
  const enterSubmit: KeyboardEventHandler<HTMLInputElement> = function (e) {
    if (e.key === 'Enter') {
      sendMessage(messageRef.current!.value, channelInfo.channelId)
    }
  }
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
      if (messageRef.current) messageRef.current!.value = ''
    })
  }, [channelInfo.channelId])

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight + 52)
  }, [allMessages.length])

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
        <div className="main-container container">
          <div className="messages-container">
            {allMessages.map((data, idx) => (
              <MemberMessage key={idx} {...data} />
            ))}
          </div>
          <label htmlFor="message" className="message-input">
            <input
              type="text"
              id="message"
              placeholder="Type a message here"
              autoComplete="off"
              ref={messageRef}
              onKeyDown={enterSubmit}
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
