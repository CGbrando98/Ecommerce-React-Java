import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import baseUrl from '../config'

// api call
export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (input, { rejectWithValue }) => {
    const { token, userId } = input
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    try {
      const res = await axios.get(`${baseUrl}/api/users/${userId}`, config)
      return { ...res.data }
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
)

// api call
export const deleteUser = createAsyncThunk(
  'userDelete/deleteUser',
  async (input, { rejectWithValue }) => {
    const { token, userId } = input
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    try {
      const res = await axios.delete(`${baseUrl}/api/users/${userId}`, config)
      return { ...res.data }
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
)

// api call for updating fetched user as admin
export const updateUserAsAdmin = createAsyncThunk(
  'user/updateUserAsAdmin',
  async (input, { rejectWithValue }) => {
    const { token, userId, username, email, isAdmin } = input
    const role = isAdmin ? 'ROLE_ADMIN' : 'ROLE_USER'
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    try {
      const res = await axios.put(
        `${baseUrl}/api/users/${userId}`,
        { username, email, role },
        config
      )
      return { ...res.data }
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
)

// setting state
const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: {},
    status: 'idle',
    error: null,
  },
  reducers: {
    //userReset
    fetchUserReset: (state, action) => {
      state.status = 'idle'
      state.error = null
      state.user = {}
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'user fetched'
        state.error = null
        state.user = action.payload
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'error fetching user'
        state.error = action.payload.message
      })

    builder
      .addCase(deleteUser.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = 'user deleted'
        state.error = null
        state.user = {}
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = 'error deleting user'
        state.error = action.payload.message
      })

    builder
      .addCase(updateUserAsAdmin.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(updateUserAsAdmin.fulfilled, (state, action) => {
        state.status = 'user updated by admin'
        state.error = null
        state.user = action.payload
      })
      .addCase(updateUserAsAdmin.rejected, (state, action) => {
        state.status = 'error updating user by admin'
        state.error = action.payload.message
      })
  },
})

export const selectUser = (state) => state.user.user
export const selectUserStatus = (state) => state.user.status
export const selectUserError = (state) => state.user.error

export const { fetchUserReset } = userSlice.actions
export const userReducer = userSlice.reducer
