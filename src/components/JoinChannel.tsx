import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore'

import { database, auth } from './Data/firebase'

const JoinChannel: React.FC = function () {
  const navigate = useNavigate()
  const params = useParams()

  const id = params.channelId!.slice(1)

  useEffect(() => {
    const channel = doc(database, 'channels', id)
    if (!auth.currentUser) navigate('/signup')
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
  })

  return <p>Loading...</p>
}

export default JoinChannel
