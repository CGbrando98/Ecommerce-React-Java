// src/redux/cartSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import baseUrl from '../config'

const initialState = {
  ordersPlaced: [],
  status: 'idle', // idle, loading, succeeded, failed
  error: null,
}

// api call to get orders by id
export const getOrdersPlacedByUserId = createAsyncThunk(
  'ordersPlaced/getOrdersPlacedByUserId',
  async (input, { rejectWithValue }) => {
    const { token, userId } = input
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    try {
      const res = await axios.get(
        `${baseUrl}/api/orders/profile/${userId}`,
        config
      )

      return [...res.data]
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
)

// api call to get orders
export const getOrdersPlaced = createAsyncThunk(
  'ordersPlaced/getOrdersPlaced',
  async (token, { rejectWithValue }) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    try {
      const res = await axios.get(`${baseUrl}/api/orders`, config)

      return [...res.data]
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
)

// setting state
const ordersPlacedSlice = createSlice({
  name: 'ordersPlaced',
  initialState,
  reducers: {
    resetOrdersPlaced: (state, action) => {
      state.ordersPlaced = []
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrdersPlacedByUserId.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(getOrdersPlacedByUserId.fulfilled, (state, action) => {
        state.status = 'orders fetched by user id'
        state.ordersPlaced = action.payload
        state.error = null
      })
      .addCase(getOrdersPlacedByUserId.rejected, (state, action) => {
        state.status = 'error fetching orders by user id'
        state.error = action.payload.message
      })

    builder
      .addCase(getOrdersPlaced.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(getOrdersPlaced.fulfilled, (state, action) => {
        state.status = 'all orders fetched'
        state.ordersPlaced = action.payload
        state.error = null
      })
      .addCase(getOrdersPlaced.rejected, (state, action) => {
        state.status = 'error fetching all orders'
        state.error = action.payload.message
      })
  },
})

export const selectOrdersPlaced = (state) => state.ordersPlaced.ordersPlaced
export const selectOrdersPlacedStatus = (state) => state.ordersPlaced.status
export const selectOrdersPlacedError = (state) => state.ordersPlaced.error

export const { resetOrdersPlaced } = ordersPlacedSlice.actions
export const ordersPlacedReducer = ordersPlacedSlice.reducer
