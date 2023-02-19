import React from 'react'
import { useParams } from 'react-router-dom'

const JoinChannel: React.FC<{ setJoinChannelId: Function }> = function ({
  setJoinChannelId,
}) {
  const params = useParams()

  const id = params.channelId!.slice(1)
  setJoinChannelId(id)

  return <p>Loading...</p>
}

export default JoinChannel
