import { useReducer, useEffect, useState } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { onAuthStateChanged } from 'firebase/auth'

import { actions } from './components/store/AuthState'
import { auth } from './components/Data/firebase'
import Login from './components/Auth/Login'
import userImg from './assets/MyProfile.jpg'
import ChannelInfoNav from './components/ChannelInfoNav'
import ChatInterface from './components/ChatInterface'
import AllChannels from './components/AllChannels'
import SignUp from './components/Auth/SignUp'

interface reducer {
  channelName: string
  channelDesc: string
  channelMembers: [string, string][]
}

const channelReducerFn = function (
  state: reducer,
  action: { type: string; payload: any }
): reducer {
  return {
    channelName: '',
    channelDesc: '',
    channelMembers: [],
  }
}

const initialReducerArg: reducer = {
  channelName: 'Front-end developers',
  channelDesc:
    'Pellentesque sagittis elit enim, sit amet ultrices tellus accumsan quis. In gravida mollis purus, at interdum arcu tempor non',
  channelMembers: [
    [userImg, 'Xanthe Neal'],
    [userImg, 'Nellie Francis'],
    [userImg, 'Denzel Barrett'],
  ],
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
