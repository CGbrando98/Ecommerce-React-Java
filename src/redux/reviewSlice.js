import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import baseUrl from '../config'

// api call
export const createReview = createAsyncThunk(
  'review/createReview',
  async (input, { rejectWithValue }) => {
    const { token, userId, id: productId, rating, comment } = input
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
    try {
      const res = await axios.post(
        `${baseUrl}/api/products/${productId}/reviews`,
        { userid: userId, rating, comment },
        config
      )

      return { ...res.data }
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
)

// setting state
const reviewSlice = createSlice({
  name: 'review',
  initialState: {
    status: 'idle',
    error: null,
  },
  reducers: {
    resetReview: (state, action) => {
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createReview.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.status = 'review submitted'
        state.error = null
      })
      .addCase(createReview.rejected, (state, action) => {
        state.status = 'error submitting review '
        state.error = action.payload.message
      })
  },
})

export const selectReviewStatus = (state) => state.review.status
export const selectReviewError = (state) => state.review.error

export const { resetReview } = reviewSlice.actions
export const reviewReducer = reviewSlice.reducer
