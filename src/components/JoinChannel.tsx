import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { actions } from './store/AuthState'

const JoinChannel: React.FC = function () {
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const id = params.channelId!.slice(1)
  dispatch(actions.setInviteId({ inviteId: id }))
  navigate('/channels')

  return <p>Loading...</p>
}

export default JoinChannel
