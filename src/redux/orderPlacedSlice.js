// src/redux/cartSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import baseUrl from '../config'

const initialState = {
  orderPlaced: {},
  status: 'idle', // idle, loading, succeeded, failed
  error: null,
}

// api call to get order by id
export const getOrderPlacedById = createAsyncThunk(
  'orderPlaced/getOrderPlacedById',
  async (input, { rejectWithValue }) => {
    const { token, orderId } = input
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    try {
      const res = await axios.get(`${baseUrl}/api/orders/${orderId}`, config)

      return { ...res.data }
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
)

// api call to pay for order
export const payOrderPlaced = createAsyncThunk(
  'orderPlaced/payOrderPlaced',
  async (input, { rejectWithValue }) => {
    const { token, orderId, paymentResult } = input
    // console.log(paymentResult)
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
    try {
      const res = await axios.put(
        `${baseUrl}/api/orders/${orderId}/pay`,
        {
          id_paymentpaypal: paymentResult.id,
          paymentstatus: paymentResult.status,
          paymentupdatetime: paymentResult.update_time,
          paymentemail: paymentResult.payer.email_address,
        },
        config
      )
      console.log({ ...res.data })
      return { ...res.data }
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
)

// api call for admin to set order as delievered
export const deliverOrderPlaced = createAsyncThunk(
  'orderPlaced/deliverOrderPlaced',
  async (input, { rejectWithValue }) => {
    const { token, orderId } = input
    // console.log(orderId, token)
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    try {
      const res = await axios.put(
        `${baseUrl}/api/orders/${orderId}/deliver`,
        {},
        config
      )

      return { ...res.data }
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
)

// setting state
const orderPlacedSlice = createSlice({
  name: 'orderPlaced',
  initialState,
  reducers: {
    resetOrderPlaced: (state, action) => {
      state.orderPlaced = {}
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderPlacedById.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(getOrderPlacedById.fulfilled, (state, action) => {
        state.status = 'order fetched'
        state.orderPlaced = action.payload
      })
      .addCase(getOrderPlacedById.rejected, (state, action) => {
        state.status = 'error fetching order by id'
        state.error = action.payload.message
      })

    builder
      .addCase(payOrderPlaced.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(payOrderPlaced.fulfilled, (state, action) => {
        state.status = 'order paid'
        state.orderPlaced = action.payload
      })
      .addCase(payOrderPlaced.rejected, (state, action) => {
        state.status = 'pay error'
        state.error = action.payload.message
      })

    builder
      .addCase(deliverOrderPlaced.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(deliverOrderPlaced.fulfilled, (state, action) => {
        state.status = 'order delivered'
        state.orderPlaced = action.payload
      })
      .addCase(deliverOrderPlaced.rejected, (state, action) => {
        state.status = 'delivery error'
        state.error = action.payload.message
      })
  },
})

export const selectOrderPlaced = (state) => state.orderPlaced.orderPlaced
export const selectOrderPlacedStatus = (state) => state.orderPlaced.status
export const selectOrderPlacedError = (state) => state.orderPlaced.error

export const { resetOrderPlaced } = orderPlacedSlice.actions
export const orderPlacedReducer = orderPlacedSlice.reducer
