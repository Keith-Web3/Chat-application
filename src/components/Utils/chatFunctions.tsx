import { doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore'
import { nanoid } from 'nanoid'

import { database } from '../Data/firebase'
import { auth } from '../Data/firebase'

export const createChannel = async function (
  channelName: string,
  channelDescription: string
) {
  try {
    const id = `${nanoid()}${Date.now()}`
    const response = await setDoc(doc(database, 'channels', id), {
      channelName,
      channelDescription,
      id,
      members: [
        {
          id: auth.currentUser!.uid,
          photoURL: auth.currentUser!.photoURL,
          name: auth.currentUser!.displayName,
          email: auth.currentUser!.email,
        },
      ],
      messages: [],
    })
    console.log('channel created!')
  } catch (err: any) {
    console.log(err.message)
  }
}

export const sendMessage = async function (message: string, channelId: string) {
  if (message.trim().length === 0) return
  const channelRef = doc(database, 'channels', channelId)

  await updateDoc(channelRef, {
    messages: arrayUnion({
      message,
      userName:
        auth.currentUser?.displayName ||
        auth.currentUser?.email?.slice(
          0,
          auth.currentUser?.email?.indexOf('@')
        ),
      userImg: auth.currentUser?.photoURL,
      email: auth.currentUser?.email,
      date: Date.now(),
    }),
  })
}
