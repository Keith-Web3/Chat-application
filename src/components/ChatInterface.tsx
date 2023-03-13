import React, {
  MouseEvent,
  useRef,
  useState,
  useEffect,
  KeyboardEventHandler,
} from 'react'
import ReactDOM from 'react-dom'
import { Outlet, useNavigate } from 'react-router-dom'
import { onSnapshot, collection } from 'firebase/firestore'
import { AnimatePresence } from 'framer-motion'

import { sendMessage } from './Utils/chatFunctions'
import { auth, database } from './Data/firebase'
import MemberMessage from './MemberMessage'
import sendBtn from '../assets/paper-plane-solid.svg'
import bars from '../assets/bars-solid.svg'
import Modal from './UI/Modal'
import videoCallIcon from '../assets/video_call_FILL0_wght400_GRAD0_opsz48.svg'
import '../sass/chat_interface.scss'

interface ChatInterfaceProps {
  channelInfo: {
    channelName: string
    channelDesc: string
    channelId: string
    isPrivate?: boolean
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
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const textAreaWidth = useRef<HTMLDivElement>(null)
  const [allMessages, setAllMessages] = useState<
    {
      date: number
      message: string
      userImg: string
      userName: string
      email: string
    }[]
  >([{ date: 0, message: '', userImg: '', userName: '', email: '' }])
  const handleNavToggle = function () {
    setIsNavOpen((prev: boolean) => !prev)
  }
  const enterSubmit: KeyboardEventHandler<HTMLTextAreaElement> = function (e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      sendMessage(messageRef.current!.value, auth.currentUser!.uid, channelInfo)
      setMessage('')
      textAreaWidth.current!.innerHTML = ''
      messageRef.current!.style.height =
        textAreaWidth.current!.clientHeight + 'px'
    }
  }
  const onInput: KeyboardEventHandler<HTMLTextAreaElement> = function () {
    const re = /\n/g
    const text = messageRef.current!.value.split(re).map(el => {
      if (el.trim() === '') {
        el = 'a'
      }
      return `<p>${el}</p>`
    })
    textAreaWidth.current!.style.width = messageRef.current!.clientWidth + 'px'
    textAreaWidth.current!.innerHTML = text.join('')
    messageRef.current!.style.height =
      textAreaWidth.current!.clientHeight + 'px'
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(database, 'channels'), data => {
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
      setMessage(messageRef.current!.value)
      if (messageRef.current) messageRef.current!.value = ''
    })

    return unsubscribe
  }, [channelInfo.channelId])

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight + 52)
    messageRef.current!.value = message
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
          {(channelInfo.channelMembers.length === 3 ||
            channelInfo.isPrivate) && (
            <img
              className="video-call"
              src={videoCallIcon}
              alt="video call"
              onClick={() => navigate('/call')}
            />
          )}
        </header>
        <div className="main-container container">
          <div className="messages-container">
            {allMessages.map((data, idx) => (
              <MemberMessage key={idx} {...data} />
            ))}
          </div>
          {!(
            channelInfo.channelId === '16A4w32PivaHAasvXbflX1676971533389' &&
            auth.currentUser!.uid !== import.meta.env.VITE_ADMIN_ID
          ) && (
            <label htmlFor="message" className="message-input">
              <textarea
                id="message"
                placeholder="Type a message here"
                autoComplete="off"
                ref={messageRef}
                onKeyDown={enterSubmit}
                onInput={onInput}
              />
              <div className="textarea-width" ref={textAreaWidth}></div>
              <button
                onClick={() => {
                  sendMessage(
                    messageRef.current!.value,
                    auth.currentUser!.uid,
                    channelInfo
                  )
                  setMessage('')
                }}
              >
                <img src={sendBtn} alt="send" />
              </button>
            </label>
          )}
        </div>
        {ReactDOM.createPortal(
          <AnimatePresence>
            {isModalOpen && <Modal setIsModalOpen={setIsModalOpen} />}
          </AnimatePresence>,
          document.getElementById('modal-root') as Element
        )}
      </section>
    </main>
  )
}

export default ChatInterface
