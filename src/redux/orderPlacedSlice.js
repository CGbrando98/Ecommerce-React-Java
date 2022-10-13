// src/redux/cartSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  orderPlaced: {},
  status: 'idle', // idle, loading, succeeded, failed
  error: null,
}

// api call to get order by id
export const getOrderPlacedById = createAsyncThunk(
  'orderPlaced/getOrderPlacedById',
  async (input) => {
    const { token, orderId } = input
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const res = await axios.get(
      `http://localhost:8080/api/orders/${orderId}`,
      config
    )

    return { ...res.data }
  }
)

// api call to pay for order
export const payOrderPlaced = createAsyncThunk(
  'orderPlaced/payOrderPlaced',
  async (input) => {
    const { token, orderId, paymentResult } = input
    // console.log(paymentResult)
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
    const res = await axios.put(
      `http://localhost:8080/api/orders/${orderId}/pay`,
      {
        id_paymentpaypal: paymentResult.id,
        paymentstatus: paymentResult.status,
        paymentupdatetime: paymentResult.update_time,
        paymentemail: paymentResult.payer.email_address,
      },
      config
    )

    return { ...res.data }
  }
)

// setting state
const orderPlacedSlice = createSlice({
  name: 'orderPlaced',
  initialState,
  reducers: {},
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
        state.status = 'failed'
        state.error = action.error.message
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
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export const selectOrderPlaced = (state) => state.orderPlaced.orderPlaced
export const selectOrderPlacedStatus = (state) => state.orderPlaced.status
export const selectOrderPlacedError = (state) => state.orderPlaced.error

export const orderPlacedReducer = orderPlacedSlice.reducer
