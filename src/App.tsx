import { useReducer, useEffect, useState } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { useSelector, useDispatch } from 'react-redux'
import { onAuthStateChanged } from 'firebase/auth'

import { actions } from './components/store/AuthState'
import { auth, database } from './components/Data/firebase'
import Login from './components/Auth/Login'
import userImg from './assets/MyProfile.jpg'
import ChannelInfoNav from './components/ChannelInfoNav'
import ChatInterface from './components/ChatInterface'
import AllChannels from './components/AllChannels'
import SignUp from './components/Auth/SignUp'
import { nanoid } from '@reduxjs/toolkit'
import JoinChannel from './components/JoinChannel'

interface reducer {
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

const channelReducerFn = function (
  state: reducer,
  action: { type: string; payload: reducer }
): reducer {
  return action.payload
}

const initialReducerArg: reducer = {
  channelName: 'Front-end developers',
  channelId: nanoid(),
  channelDesc:
    'Pellentesque sagittis elit enim, sit amet ultrices tellus accumsan quis. In gravida mollis purus, at interdum arcu tempor non',
  channelMembers: [
    {
      id: nanoid(),
      photoURL: userImg,
      name: 'Xanthe Neal',
      email: 'xan@gmail.com',
    },
  ],
  channelMessages: [],
}

const App: React.FC = function () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [channelInfo, dispatchFn] = useReducer(
    channelReducerFn,
    initialReducerArg
  )
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false)
  const [joinChannelId, setJoinChannelId] = useState<string>('')

  const user = useSelector((state: { user: any; isLoggedIn: boolean }) => state)

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) dispatch(actions.login({ user: user, navigateFn: navigate }))
    })

    const channel = doc(database, 'channels', joinChannelId)
    ;(async () => {
      await updateDoc(channel, {
        members: arrayUnion({
          id: auth.currentUser!.uid,
          photoURL: auth.currentUser!.photoURL,
          name: auth.currentUser!.displayName,
          email: auth.currentUser!.email,
        }),
      })
    })()
  }, [])

  useEffect(() => {
    document.body.style.overflowY = isModalOpen ? 'hidden' : 'unset'
    document.querySelector('html')!.style.overflowY = isModalOpen
      ? 'hidden'
      : 'unset'
    window.scrollTo(0, 0)
  }, [isModalOpen])

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/join"
        element={<JoinChannel setJoinChannelId={setJoinChannelId} />}
      />
      {user.user && (
        <Route
          path="/"
          element={
            <ChatInterface
              isModalOpen={isModalOpen}
              setIsNavOpen={setIsNavOpen}
              setIsModalOpen={setIsModalOpen}
              channelInfo={channelInfo}
            />
          }
        >
          <Route
            path=":name"
            element={
              <ChannelInfoNav isNavOpen={isNavOpen} channelInfo={channelInfo} />
            }
          />
          <Route
            path="channels"
            element={
              <AllChannels
                isNavOpen={isNavOpen}
                setIsModalOpen={setIsModalOpen}
                channelDispatch={dispatchFn}
              />
            }
          />
        </Route>
      )}
      <Route path="*" element={<Navigate to={'/signup'} />} />
    </Routes>
  )
}

export default App
