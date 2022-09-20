import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const URL = 'http://localhost:8080/api/products'

// intial state before an actions are dispatched
const initialState = {
  products: [],
  status: 'idle', // idle, loading, succeeded, failed
  error: null,
}

// api call
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const res = await axios.get(URL)
    // throw new Error('Error testing')
    console.log(res.data)
    return [...res.data]
  }
)

// setting state
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.products = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export const selectProducts = (state) => state.products.products
export const selectProductsStatus = (state) => state.products.status
export const selectProductsError = (state) => state.products.error

export default productsSlice.reducer
