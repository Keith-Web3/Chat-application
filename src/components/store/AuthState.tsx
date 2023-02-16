import { createSlice, configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'
import {
  auth,
  googleProvider,
  facebookProvider,
  githubProvider,
  twitterProvider,
} from '../Data/firebase'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    errorMessage: '',
    user: null,
    isLoading: false,
  },
  reducers: {
    submit(state, { payload: { user, error } }) {
      if (user) {
        state.isLoggedIn = true
        state.user = JSON.stringify(user)
      } else {
        state.errorMessage = error
      }
    },
    setLoading(state, action) {
      state.isLoading = action.payload.isLoading
    },
    resetErrorMessage(state, action) {
      window.scrollTo(0, 0)
      state.errorMessage = action.payload
    },
  },
})

export const submit = function ({
  type,
  email,
  password,
  navigate,
  isLoading,
}) {
  return async dispatch => {
    try {
      if (isLoading === true)
        throw new Error('Please wait, previous request processing...')
      dispatch(authSlice.actions.setLoading({ isLoading: true }))
      let userCredentials
      switch (type) {
        case 'SIGNUP':
          userCredentials = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          )
          break
        case 'LOGIN':
          userCredentials = await signInWithEmailAndPassword(
            auth,
            email,
            password
          )
          break
        case 'GOOGLE':
          userCredentials = await signInWithPopup(auth, googleProvider)
          break
        case 'FACEBOOK':
          userCredentials = await signInWithPopup(auth, facebookProvider)
          console.log(userCredentials)
          break
        case 'GITHUB':
          userCredentials = await signInWithPopup(auth, githubProvider)
          break
        case 'TWITTER':
          userCredentials = await signInWithPopup(auth, twitterProvider)
          break
        default:
          break
      }
      dispatch(
        authSlice.actions.submit({
          user: userCredentials.user,
          error: null,
        })
      )
      navigate('/profile')
    } catch (err) {
      dispatch(
        authSlice.actions.submit({
          user: null,
          error: err.message,
        })
      )
    } finally {
      dispatch(authSlice.actions.setLoading({ isLoading: false }))
    }
  }
}

export const actions = authSlice.actions
export const store = configureStore({
  reducer: authSlice.reducer,
  middleware: [thunk],
})
