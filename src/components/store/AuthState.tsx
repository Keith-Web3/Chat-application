import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit'
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from 'firebase/auth'
import thunk from 'redux-thunk'
import { NavigateFunction } from 'react-router-dom'

import { auth, googleProvider } from '../Data/firebase'
interface SignIn {
  type: 'GOOGLE' | 'EMAILANDPASSWORDSIGNUP' | 'EMAILANDPASSWORDLOGIN'
  email?: string
  password?: string
  navigateFn: NavigateFunction
}

const initialState: {
  user: null | { [props: string]: any }
  isLoggedIn: boolean
} = {
  user: null,
  isLoggedIn: false,
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
      }
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

          dispatch(userState.actions.login({ user, navigateFn }))
        }
      }
    } catch (err: any) {
      console.log(err.message)
    }
  }
}

export const actions = userState.actions

export const store = configureStore({
  reducer: userState.reducer,
  middleware: [thunk],
})
