import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const JoinChannel: React.FC<{ setJoinChannelId: Function }> = function ({
  setJoinChannelId,
}) {
  const params = useParams()
  const navigate = useNavigate()

  const id = params.channelId!.slice(1)
  setJoinChannelId(id)
  navigate('/channels')

  return <p>Loading...</p>
}

export default JoinChannel
