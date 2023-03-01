import { doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore'
import { nanoid } from 'nanoid'
import { Configuration, OpenAIApi } from 'openai'

import { database } from '../Data/firebase'
import { auth } from '../Data/firebase'

const configuration = new Configuration({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

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
        {
          id: 'openai',
          photoURL: 'openai',
          name: 'OpenAI',
          email: null,
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

  if (message.trim().toLowerCase().endsWith('/replyai')) {
    const userName =
      auth.currentUser?.displayName ||
      auth.currentUser?.email?.slice(0, auth.currentUser?.email?.indexOf('@'))
    await updateDoc(channelRef, {
      messages: arrayUnion({
        message,
        userName,
        userImg: auth.currentUser?.photoURL,
        email: auth.currentUser?.email,
        date: Date.now(),
      }),
    })
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: message.trim().split(' ').slice(0, -1).join(' '),
      max_tokens: 100,
      temperature: 1.5,
    })
    await updateDoc(channelRef, {
      messages: arrayUnion({
        message: `@${userName} ${response.data.choices[0].text}`,
        userName: 'openai',
        userImg: 'openai',
        email: null,
        date: Date.now(),
      }),
    })
    return
  }
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
