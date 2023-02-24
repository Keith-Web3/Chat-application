import { useReducer, useEffect, useState } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { onAuthStateChanged } from 'firebase/auth'
import { nanoid } from '@reduxjs/toolkit'

import { actions } from './components/store/AuthState'
import { auth } from './components/Data/firebase'
import Login from './components/Auth/Login'
import userImg from './assets/MyProfile.jpg'
import ChannelInfoNav from './components/ChannelInfoNav'
import ChatInterface from './components/ChatInterface'
import AllChannels from './components/AllChannels'
import SignUp from './components/Auth/SignUp'
import JoinChannel from './components/JoinChannel'
import CallInterface from './components/web-rtc/CallInterface'

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
  channelName: 'DEFAULT CHANNEL',
  channelId: '16A4w32PivaHAasvXbflX1676971533389',
  channelDesc: 'Test channel for all users',
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

  const user = useSelector((state: { user: any; isLoggedIn: boolean }) => state)

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) dispatch(actions.login({ user: user, navigateFn: navigate }))
    })
  }, [])

  useEffect(() => {
    document.querySelector('html')!.style.overflowY = isModalOpen
      ? 'hidden'
      : 'unset'
  }, [isModalOpen])

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/join/:channelId" element={<JoinChannel />} />
      {user.user && (
        <>
          <Route
            path="/call"
            element={<CallInterface channelId={channelInfo.channelId} />}
          />
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
                <ChannelInfoNav
                  isNavOpen={isNavOpen}
                  channelInfo={channelInfo}
                  channelDispatch={dispatchFn}
                />
              }
            />
            <Route
              path="channels"
              element={
                <AllChannels
                  isNavOpen={isNavOpen}
                  setIsModalOpen={setIsModalOpen}
                  channelId={channelInfo.channelId}
                  channelDispatch={dispatchFn}
                />
              }
            />
          </Route>
        </>
      )}
      <Route path="*" element={<Navigate to={'/login'} />} />
    </Routes>
  )
}

export default App
