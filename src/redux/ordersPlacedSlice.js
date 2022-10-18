// src/redux/cartSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  ordersPlaced: [],
  status: 'idle', // idle, loading, succeeded, failed
  error: null,
}

// api call to get orders by id
export const getOrdersPlacedByUserId = createAsyncThunk(
  'ordersPlaced/getOrdersPlacedByUserId',
  async (input) => {
    const { token, userId } = input
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const res = await axios.get(
      `http://localhost:8080/api/orders/profile/${userId}`,
      config
    )

    return [...res.data]
  }
)

// api call to get orders
export const getOrdersPlaced = createAsyncThunk(
  'ordersPlaced/getOrdersPlaced',
  async (token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const res = await axios.get(`http://localhost:8080/api/orders`, config)

    return [...res.data]
  }
)

// setting state
const ordersPlacedSlice = createSlice({
  name: 'ordersPlaced',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrdersPlacedByUserId.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(getOrdersPlacedByUserId.fulfilled, (state, action) => {
        state.status = 'orders fetched By User Id'
        state.ordersPlaced = action.payload
      })
      .addCase(getOrdersPlacedByUserId.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

    builder
      .addCase(getOrdersPlaced.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(getOrdersPlaced.fulfilled, (state, action) => {
        state.status = 'All orders fetched'
        state.ordersPlaced = action.payload
      })
      .addCase(getOrdersPlaced.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export const selectOrdersPlaced = (state) => state.ordersPlaced.ordersPlaced
export const selectOrdersPlacedStatus = (state) => state.ordersPlaced.status
export const selectOrdersPlacedError = (state) => state.ordersPlaced.error

export const ordersPlacedReducer = ordersPlacedSlice.reducer
