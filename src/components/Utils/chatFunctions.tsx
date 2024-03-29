import { doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore'
import { nanoid } from 'nanoid'
import {
  ChatCompletionRequestMessage,
  Configuration,
  CreateCompletionRequest,
  OpenAIApi,
} from 'openai'

import { database } from '../Data/firebase'
import { auth } from '../Data/firebase'

const configuration = new Configuration({
  apiKey: rot13(import.meta.env.VITE_OPENAI_API_KEY),
})
const openai = new OpenAIApi(configuration)

export const createChannel = async function (
  channelName: string | [string, string],
  channelDescription: string,
  id: string = `${nanoid()}${Date.now()}`,
  isPrivate?: boolean,
  channelMembers?: any[]
) {
  try {
    const response = await setDoc(doc(database, 'channels', id), {
      channelName,
      channelDescription,
      id,
      isPrivate: !!isPrivate,
      members: isPrivate
        ? channelMembers
        : [
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
  user: string,
  channelInfo: {
    channelName: string
    channelDesc: string
    channelId: string
    isPrivate?: boolean
    channelMembers: {
      id: string
      photoURL: string
      name: string
      email: string
    }[]
    channelMessages: any[]
  }
) {
  if (message.trim().length === 0) return
  const channelRef = doc(database, 'channels', channelInfo.channelId)

  try {
    if (message.trim().toLowerCase().startsWith('@openai')) {
      const userName =
        auth.currentUser?.displayName ||
        auth.currentUser?.email?.slice(0, auth.currentUser?.email?.indexOf('@'))
      const prompt = [
        {
          role: 'system',
          content:
            'You are a chatbot in a chat application. Always tag every user you respond to.',
        },
        ...channelInfo.channelMessages.slice(-25).map(message => ({
          role: message.id
            ? message.id === 'openai'
              ? 'assistant'
              : 'user'
            : message.userName === 'openai'
            ? 'assistant'
            : 'user',
          content: `\n\n${message.message}`,
        })),
        { role: 'user', content: `\n\n${userName}: ${message}` },
      ]

      await updateDoc(channelRef, {
        messages: arrayUnion({
          message,
          userName,
          userImg: auth.currentUser?.photoURL,
          email: auth.currentUser?.email,
          date: Date.now(),
          user,
        }),
      })
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: prompt as ChatCompletionRequestMessage[],
        max_tokens: 100,
        temperature: 0.8,
      })
      await updateDoc(channelRef, {
        messages: arrayUnion({
          message: `${response.data.choices[0].message?.content}`,
          userName: 'openai',
          userImg: 'openai',
          email: null,
          date: Date.now(),
          user: 'openai',
        }),
      })
      return
    }
    await updateDoc(channelRef, {
      messages: arrayUnion({
        message,
        user,
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
  } catch (err: any) {
    if (err.code !== 'not-found') return
    if (!channelInfo.isPrivate) return
    createChannel(
      [
        channelInfo.channelName,
        auth.currentUser?.displayName ||
          auth.currentUser?.email?.slice(
            0,
            auth.currentUser?.email?.indexOf('@')
          )!,
      ],
      'Private channel',
      channelInfo.channelId,
      true,
      channelInfo.channelMembers
    )
    sendMessage(message, auth.currentUser!.uid, channelInfo)
    console.dir(err)
  }
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
