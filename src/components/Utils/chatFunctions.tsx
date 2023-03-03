import { doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore'
import { nanoid } from 'nanoid'
import { Configuration, OpenAIApi } from 'openai'

import { database } from '../Data/firebase'
import { auth } from '../Data/firebase'

const configuration = new Configuration({
  apiKey: rot13(import.meta.env.VITE_OPENAI_API_KEY),
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

export const sendMessage = async function (
  message: string,
  channelId: string,
  channelMessages: any[]
) {
  if (message.trim().length === 0) return
  const channelRef = doc(database, 'channels', channelId)

  if (message.trim().toLowerCase().startsWith('@openai')) {
    const userName =
      auth.currentUser?.displayName ||
      auth.currentUser?.email?.slice(0, auth.currentUser?.email?.indexOf('@'))
    const prompt =
      channelMessages
        .map(message => message.message)
        .slice(-30)
        .join('\n') +
      '\n' +
      message.trim().split(' ').slice(1).join(' ')
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
      prompt,
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
function rot13(message: string) {
  let result = ''
  for (let i = 0; i < message.length; i++) {
    const c = message.charCodeAt(i)
    if (c >= 65 && c <= 90) {
      result += String.fromCharCode(((c - 65 + 13) % 26) + 65)
    } else if (c >= 97 && c <= 122) {
      result += String.fromCharCode(((c - 97 + 13) % 26) + 97)
    } else {
      result += message.charAt(i)
    }
  }
  return result
}
