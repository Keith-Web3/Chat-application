import { doc, setDoc } from 'firebase/firestore'
import { nanoid } from 'nanoid'

import { database } from '../Data/firebase'
import { auth } from '../Data/firebase'

export const createChannel = async function (
  channelName: string,
  channelDescription: string
) {
  if (channelName.trim() === '') {
    alert('Please enter a name')
    return
  }
  if (channelDescription.trim() === '') {
    alert('Please enter a description')
    return
  }
  try {
    const id = `${nanoid()}${Date.now()}`
    const response = await setDoc(doc(database, 'channels', id), {
      channelName,
      channelDescription,
      id,
      members: [
        {
          id: auth.currentUser?.uid,
          photoURL: auth.currentUser?.photoURL,
          name: auth.currentUser?.displayName,
          email: auth.currentUser?.email,
        },
      ],
      messages: [],
    })
    console.log('channel created!')
  } catch (err: unknown) {
    alert(err)
  }
}
