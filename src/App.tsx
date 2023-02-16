import { useReducer } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import UserMessage from './components/UserMessage'
import userImg from './assets/MyProfile.jpg'
import ChannelInfoNav from './components/ChannelInfoNav'
import ChatInterface from './components/ChatInterface'
import AllChannels from './components/AllChannels'

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
  const [channelInfo, dispatchFn] = useReducer(
    channelReducerFn,
    initialReducerArg
  )
  const location = useLocation()
  return (
    <Routes>
      <Route path="/" element={<ChatInterface channelInfo={channelInfo} />}>
        <Route
          path=":name"
          element={<ChannelInfoNav channelInfo={channelInfo} />}
        />
        <Route path="channels" element={<AllChannels />} />
      </Route>
    </Routes>
  )
}

export default App
