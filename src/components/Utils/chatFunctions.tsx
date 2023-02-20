import { doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore'
import { nanoid } from 'nanoid'

import { database } from '../Data/firebase'
import { auth } from '../Data/firebase'
import userImg from '../../assets/account_circle_FILL0_wght400_GRAD0_opsz48.svg'

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
          id: auth.currentUser!.uid,
          photoURL: auth.currentUser!.photoURL,
          name: auth.currentUser!.displayName,
          email: auth.currentUser!.email,
        },
      ],
      messages: [],
    })
    console.log('channel created!')
  } catch (err: unknown) {
    alert(err)
  }
}

export const sendMessage = async function (message: string, channelId: string) {
  if (message.length === 0) return
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
  console.log('message sent')
}
