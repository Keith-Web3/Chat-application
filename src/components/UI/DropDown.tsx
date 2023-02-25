import React from 'react'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { doc, updateDoc, arrayRemove } from 'firebase/firestore'

import { auth, database } from '../Data/firebase'
import { actions } from '../store/AuthState'
import copyImg from '../../assets/copy-solid.svg'
import logoutBtn from '../../assets/arrow-right-from-bracket-solid.svg'
import exitIcon from '../../assets/door-open-solid.svg'
import '../../sass/UI/drop-down.scss'

interface Props {
  channelId: string
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

const DropDown: React.FC<Props> = function ({ channelId, channelDispatch }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const channelRef = doc(database, 'channels', channelId)

  const signOutHandler = function () {
    signOut(auth)
    navigate('/login')
    dispatch(actions.logout())
  }
  const exitChannelHandler = async function () {
    if (channelId === '16A4w32PivaHAasvXbflX1676971533389') {
      alert('Cannot exit default channel')
      return
    }
    await updateDoc(channelRef, {
      members: arrayRemove({
        email: auth.currentUser?.email,
        id: auth.currentUser?.uid,
        name: auth.currentUser?.displayName,
        photoURL: auth.currentUser?.photoURL,
      }),
    })
    channelDispatch({
      type: 'exit',
      payload: {
        channelName: 'DEFAULT CHANNEL',
        channelDesc: 'Test channel for all users',
        channelId: '16A4w32PivaHAasvXbflX1676971533389',
        channelMembers: [{ id: '', photoURL: '', name: '', email: '' }],
        channelMessages: [],
      },
    })
    navigate('/channels')
  }

  return (
    <motion.div
      className="drop-down"
      initial={{ y: 'calc(-100% + 30px)', opacity: 0 }}
      animate={{
        y: '-100%',
        opacity: 1,
        transition: { type: 'spring', damping: 20, stiffness: 500 },
      }}
      exit={{
        y: 'calc(-100% + 30px)',
        opacity: 0,
        transition: { type: 'tween', duration: 0.3 },
      }}
    >
      <div
        className="child copy-link"
        onClick={() => {
          navigator.clipboard.writeText(
            `https://astounding-choux-c5148e.netlify.app/join/:${channelId}`
          )
          alert('Invite link copied to clipboard!')
        }}
      >
        <p>Invite Link</p>
        <img src={copyImg} alt="copy" />
      </div>
      <div className="child exit-channel" onClick={exitChannelHandler}>
        <p>Exit channel</p>
        <img src={exitIcon} alt="exit channel" />
      </div>
      <div className="line"></div>
      <div className="child logout" onClick={signOutHandler}>
        <p>Logout</p>
        <img src={logoutBtn} alt="logout" />
      </div>
    </motion.div>
  )
}

export default DropDown
