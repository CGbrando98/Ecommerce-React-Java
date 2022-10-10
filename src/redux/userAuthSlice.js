import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

// intial state before an actions are dispatched
const initialState = localStorage.getItem('userAuth')
  ? { ...JSON.parse(localStorage.getItem('userAuth')), status: 'idle' }
  : {
      user: {},
      status: 'idle', // logged in, loading, failed
      error: null,
    }

// maybe dont send password from backend instead of deleting in front end

// api for updating profile
export const updateUser = createAsyncThunk(
  'userAuth/updateUser',
  async (input) => {
    const { username, email, password, userId, token } = input
    console.log('hit update', userId)
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
    const res = await axios.put(
      `http://localhost:8080/api/users/${userId}`,
      { username, email, password },
      config
    )
    delete res.data.password
    console.log(res.data)
    // throw new Error('Error testing')
    return { ...res.data }
  }
)

// api call for logging in user
export const loginUser = createAsyncThunk(
  'userAuth/loginUser',
  async (input) => {
    const { username, password } = input
    // console.log(username, password)
    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
    const res = await axios.post(
      `http://localhost:8080/api/login`,
      formData,
      config
    )
    // throw new Error('Error testing')
    delete res.data.userInfo.password
    return { ...res.data }
  }
)

// setting state
const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    logoutUser: (state, action) => {
      state.status = 'logged out'
      state.user = {}
      state.error = null
      localStorage.removeItem('userAuth')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'logged in'
        state.user = action.payload
        state.error = null
        localStorage.setItem('userAuth', JSON.stringify(state))
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'bad credentials'
        state.error = action.error.message
      })

    builder
      .addCase(updateUser.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'update success'
        state.user.userInfo = {
          ...state.user.userInfo,
          username: action.payload.username,
          password: action.payload.password,
          email: action.payload.email,
        }
        state.error = null
        localStorage.setItem('userAuth', JSON.stringify(state))
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'update failed'
        state.error = action.error.message
      })
  },
})

export const selectUserAuth = (state) => state.userAuth.user
export const selectUserAuthStatus = (state) => state.userAuth.status
export const selectUserAuthError = (state) => state.userAuth.error
export const { logoutUser } = userAuthSlice.actions
export const userAuthReducer = userAuthSlice.reducer
