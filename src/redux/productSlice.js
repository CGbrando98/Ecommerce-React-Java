import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

// intial state before an actions are dispatched
const initialState = {
  product: {},
  status: 'idle', // idle, loading, succeeded, failed
  error: null,
}

// api call
export const fetchProduct = createAsyncThunk(
  'product/fetchProduct',
  async (id) => {
    const res = await axios.get(`http://localhost:8080/api/products/${id}`)
    // throw new Error('Error testing')
    return { ...res.data }
  }
)

// setting state
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.product = action.payload
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export const selectProduct = (state) => state.product.product
export const selectProductStatus = (state) => state.product.status
export const selectProductError = (state) => state.product.error

export const productReducer = productSlice.reducer
