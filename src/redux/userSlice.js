import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

// api call
export const fetchUser = createAsyncThunk('user/fetchUser', async (input) => {
  const { token, userId } = input
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const res = await axios.get(
    `http://localhost:8080/api/users/${userId}`,
    config
  )
  return { ...res.data }
})

// api call
export const deleteUser = createAsyncThunk(
  'userDelete/deleteUser',
  async (input) => {
    const { token, userId } = input
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const res = await axios.delete(
      `http://localhost:8080/api/users/${userId}`,
      config
    )
    return { ...res.data }
  }
)

// api call for updating fetched user as admin
export const updateUserAsAdmin = createAsyncThunk(
  'user/updateUserAsAdmin',
  async (input) => {
    const { token, userId, username, email, isAdmin } = input
    const role = isAdmin ? 'ROLE_ADMIN' : 'ROLE_USER'
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const res = await axios.put(
      `http://localhost:8080/api/users/${userId}`,
      { username, email, role },
      config
    )
    return { ...res.data }
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
        state.status = 'User Fetched'
        state.error = null
        state.user = action.payload
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'fetch Error'
        state.error = action.payload
      })

    builder
      .addCase(deleteUser.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = 'User Deleted'
        state.error = null
        state.user = {}
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = 'Deletion Error'
        state.error = action.payload.message
      })

    builder
      .addCase(updateUserAsAdmin.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(updateUserAsAdmin.fulfilled, (state, action) => {
        state.status = 'User Updated by Admin'
        state.error = null
        state.user = action.payload
      })
      .addCase(updateUserAsAdmin.rejected, (state, action) => {
        state.status = 'Update Error'
        state.error = action.payload
      })
  },
})

export const selectUser = (state) => state.user.user
export const selectUserStatus = (state) => state.user.status
export const selectUserError = (state) => state.user.error

export const { fetchUserReset } = userSlice.actions
export const userReducer = userSlice.reducer
