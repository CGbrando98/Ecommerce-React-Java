import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import baseUrl from '../config'

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
  async (input, { rejectWithValue }) => {
    const { username, email, password, userId, token } = input
    console.log('hit update', userId)
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
    try {
      const res = await axios.put(
        `${baseUrl}/api/users/${userId}`,
        { username, email, password },
        config
      )
      delete res.data.password
      return { ...res.data }
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
)

// api call for logging in user
export const loginUser = createAsyncThunk(
  'userAuth/loginUser',
  async (input, { rejectWithValue }) => {
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
    try {
      const res = await axios.post(`${baseUrl}/api/login`, formData, config)
      // throw new Error('Error testing')
      delete res.data.userInfo.password
      return { ...res.data }
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
)

// api call for getting a new access token using refresh token
export const newAccessToken = createAsyncThunk(
  'userAuth/newAccessToken',
  async (refreshToken, { rejectWithValue }) => {
    const config = {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    }
    try {
      const res = await axios.get(`${baseUrl}/api/users/token/refresh`, config)
      return { ...res.data }
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
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
        state.error = null
      })

    builder
      .addCase(updateUser.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'user updated'
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
        state.status = 'error updating user'
        state.error = action.payload.message
      })

    builder
      .addCase(newAccessToken.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(newAccessToken.fulfilled, (state, action) => {
        state.status = 'new access token obtained'
        state.user.access_token = action.payload.access_token
        state.user.refresh_token = action.payload.refresh_token
        state.error = null
        localStorage.setItem('userAuth', JSON.stringify(state))
      })
      .addCase(newAccessToken.rejected, (state, action) => {
        state.status = 'error obtaining new access token'
        state.error = action.payload.message
      })
  },
})

export const selectUserAuth = (state) => state.userAuth.user
export const selectUserAuthStatus = (state) => state.userAuth.status
export const selectUserAuthError = (state) => state.userAuth.error
export const { logoutUser } = userAuthSlice.actions
export const userAuthReducer = userAuthSlice.reducer
