import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit'
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from 'firebase/auth'
import thunk from 'redux-thunk'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { NavigateFunction } from 'react-router-dom'

import { auth, googleProvider, database } from '../Data/firebase'
interface SignIn {
  type: 'GOOGLE' | 'EMAILANDPASSWORDSIGNUP' | 'EMAILANDPASSWORDLOGIN'
  navigateFn: NavigateFunction
  email?: string
  password?: string
}

const initialState: {
  user: null | { [props: string]: any }
  isLoggedIn: boolean
  inviteId: string
  errorMessage: string
} = {
  user: null,
  isLoggedIn: false,
  inviteId: '',
  errorMessage: '',
}

const userState = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{
        user: { [props: string]: any }
        navigateFn: NavigateFunction
      }>
    ) {
      const { payload } = action

      if (payload.user) {
        state.user = payload.user
        state.isLoggedIn = true
        payload.navigateFn('/channels')

        if (state.inviteId.length) {
          const channel = doc(database, 'channels', state.inviteId)
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
        }
      }
    },
    setInviteId(state, action: PayloadAction<{ inviteId: string }>) {
      state.inviteId = action.payload.inviteId
    },
    logout(state) {
      state.user = null
      state.isLoggedIn = false
    },
    resetErrorMessage(state, action) {
      window.scrollTo(0, 0)
      state.errorMessage = action.payload
    },
  },
})

export const signIn = function ({ type, email, password, navigateFn }: SignIn) {
  return async function (dispatch: Function): Promise<void> {
    try {
      switch (type) {
        case 'GOOGLE': {
          const response = await signInWithPopup(auth, googleProvider)
          const user = response.user

          dispatch(userState.actions.login({ user, navigateFn }))
          if (user.metadata.creationTime === user.metadata.lastSignInTime) {
            const channel = doc(
              database,
              'channels',
              '16A4w32PivaHAasvXbflX1676971533389'
            )
            const publicChannel = doc(
              database,
              'channels',
              '8BVeyNGrX0r5JUrtDm47d1677839254038'
            )
            ;(async () => {
              await updateDoc(channel, {
                members: arrayUnion({
                  id: user.uid,
                  photoURL: user.photoURL,
                  name: user.displayName,
                  email: user.email,
                }),
              })
              await updateDoc(publicChannel, {
                members: arrayUnion({
                  id: user.uid,
                  photoURL: user.photoURL,
                  name: user.displayName,
                  email: user.email,
                }),
              })
            })()
          }
          break
        }
        case 'EMAILANDPASSWORDLOGIN': {
          const response = await signInWithEmailAndPassword(
            auth,
            email!,
            password!
          )
          const user = response.user

          dispatch(userState.actions.login({ user, navigateFn }))
          break
        }
        case 'EMAILANDPASSWORDSIGNUP': {
          const response = await createUserWithEmailAndPassword(
            auth,
            email!,
            password!
          )
          const user = response.user
          const channel = doc(
            database,
            'channels',
            '16A4w32PivaHAasvXbflX1676971533389'
          )
          const publicChannel = doc(
            database,
            'channels',
            '8BVeyNGrX0r5JUrtDm47d1677839254038'
          )
          dispatch(userState.actions.login({ user, navigateFn }))
          ;(async () => {
            await updateDoc(channel, {
              members: arrayUnion({
                id: user.uid,
                photoURL: user.photoURL,
                name: user.displayName,
                email: user.email,
              }),
            })
            await updateDoc(publicChannel, {
              members: arrayUnion({
                id: user.uid,
                photoURL: user.photoURL,
                name: user.displayName,
                email: user.email,
              }),
            })
          })()
        }
      }
    } catch (err: any) {
      dispatch(actions.resetErrorMessage(err.message))
      console.log('Error:', err.message)
    }
  }
}

export const actions = userState.actions

export const store = configureStore({
  reducer: userState.reducer,
  middleware: [thunk],
})
