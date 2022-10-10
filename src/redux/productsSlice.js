import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

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
    const res = await axios.get('http://localhost:8080/api/products')
    // throw new Error('Error testing')
    return [...res.data]
  }
)

// setting state
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  // the api call is made and redux thunk knows to place the state as pending,
  //then either the call is successfull or rejected and one of the other cases is fired
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

export const productsReducer = productsSlice.reducer
