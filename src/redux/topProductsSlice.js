import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

// intial state before an actions are dispatched
const initialState = {
  products: [],
  status: 'idle', // idle, loading, succeeded, failed
  error: null,
}

// api call
export const fetchTopProducts = createAsyncThunk(
  'topProducts/fetchTopProducts',
  async () => {
    const res = await axios.get(`http://localhost:8080/api/products/top`)
    return [...res.data]
  }
)

// setting state
const topProductsSlice = createSlice({
  name: 'topProducts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopProducts.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        state.status = 'top products fetched'
        state.products = action.payload
        state.error = null
      })
      .addCase(fetchTopProducts.rejected, (state, action) => {
        state.status = 'fetch error'
        state.error = action.error.message
      })
  },
})

export const selectTopProducts = (state) => state.topProducts.products
export const selectTopProductsStatus = (state) => state.topProducts.status
export const selectTopProductsError = (state) => state.topProducts.error

export const topProductsReducer = topProductsSlice.reducer
