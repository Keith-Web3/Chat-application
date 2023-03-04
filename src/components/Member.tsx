import React from 'react'

import { auth } from './Data/firebase'
import openai from '../assets/chatgpt-logo-02AFA704B5-seeklogo.com.png'
import userImg from '../assets/account_circle_FILL0_wght400_GRAD0_opsz48.svg'
import '../sass/member.scss'

interface MemberProps {
  img: string
  name: string
  email: string
  id: string
  isPrivate?: boolean
  channelDispatch: React.Dispatch<{
    type: string
    payload: {
      channelName: string
      channelDesc: string
      channelId: string
      isPrivate: boolean
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

const Member: React.FC<MemberProps> = function ({
  img,
  name,
  id,
  isPrivate,
  channelDispatch,
  email = '',
}) {
  const editedName = name || email.slice(0, email.indexOf('@'))

  const openPrivateChat = function () {
    if (id === 'openai' || auth.currentUser!.uid === id) return
    if (isPrivate) return
    const privateChatId = [auth.currentUser!.uid, id].sort().join('')
    channelDispatch({
      type: 'channelDispatch',
      payload: {
        channelName: editedName,
        channelDesc: 'Private Chat',
        channelId: privateChatId,
        isPrivate: true,
        channelMembers: [
          { id, photoURL: img, name: editedName, email },
          {
            id: auth.currentUser!.uid,
            photoURL: auth.currentUser!.photoURL!,
            name:
              auth.currentUser!.displayName ||
              auth.currentUser!.email!.slice(
                0,
                auth.currentUser!.email!.indexOf('@')
              ),
            email: auth.currentUser!.email!,
          },
        ],
        channelMessages: [],
      },
    })
  }

  return (
    <div className="member" onClick={openPrivateChat}>
      <img
        src={img === 'openai' ? openai : img || userImg}
        alt={editedName}
        onError={e => {
          ;(e.target as HTMLImageElement).src = userImg
        }}
      />
      <p className={editedName}>{editedName}</p>
    </div>
  )
}

export default Member
