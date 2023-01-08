import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import baseUrl from '../config'

// api call
export const registerUser = createAsyncThunk(
  'userRegister/registerUser',
  async (input, { rejectWithValue }) => {
    const { username, email, password } = input
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    try {
      const res = await axios.post(
        `${baseUrl}/api/users`,
        { username, email, password },
        config
      )
      return { ...res.data }
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
)

// setting state
const userRegisterSlice = createSlice({
  name: 'userRegister',
  initialState: {
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'Registered'
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'Registration Error'
        state.error = action.payload.message
      })
  },
})

export const selectUserRegisterStatus = (state) => state.userRegister.status
export const selectUserRegisterError = (state) => state.userRegister.error

export const userRegisterReducer = userRegisterSlice.reducer
