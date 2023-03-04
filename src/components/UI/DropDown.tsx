import React from 'react'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { doc, updateDoc, arrayRemove, deleteDoc } from 'firebase/firestore'

import { auth, database } from '../Data/firebase'
import { actions } from '../store/AuthState'
import copyImg from '../../assets/copy-solid.svg'
import logoutBtn from '../../assets/arrow-right-from-bracket-solid.svg'
import exitIcon from '../../assets/door-open-solid.svg'
import '../../sass/UI/drop-down.scss'

interface Props {
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

const DropDown: React.FC<Props> = function ({ channelInfo, channelDispatch }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const channelRef = doc(database, 'channels', channelInfo.channelId)

  const signOutHandler = function () {
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
    signOut(auth)
    navigate('/login')
    dispatch(actions.logout())
  }
  const exitChannelHandler = async function () {
    if (channelInfo.channelId === '16A4w32PivaHAasvXbflX1676971533389') {
      dispatch(actions.resetErrorMessage('Cannot exit default channel'))
      return
    }
    if (channelInfo.channelMembers.length === 2) {
      await deleteDoc(doc(database, 'channels', channelInfo.channelId))
    } else {
      await updateDoc(channelRef, {
        members: arrayRemove({
          email: auth.currentUser?.email,
          id: auth.currentUser?.uid,
          name: auth.currentUser?.displayName,
          photoURL: auth.currentUser?.photoURL,
        }),
      })
    }
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
      {!channelInfo.isPrivate && (
        <>
          <div
            className="child copy-link"
            onClick={() => {
              navigator.clipboard.writeText(
                `https://astounding-choux-c5148e.netlify.app/join/:${channelInfo.channelId}`
              )
              dispatch(
                actions.resetErrorMessage('Invite link copied to clipboard!')
              )
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
        </>
      )}
      <div className="child logout" onClick={signOutHandler}>
        <p>Logout</p>
        <img src={logoutBtn} alt="logout" />
      </div>
    </motion.div>
  )
}

export default DropDown
