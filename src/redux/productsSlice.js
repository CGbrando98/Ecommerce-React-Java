import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import baseUrl from '../config'

// intial state before an actions are dispatched
const initialState = {
  products: [],
  page: null,
  pages: null,
  status: 'idle', // idle, loading, succeeded, failed
  error: null,
}

// api call
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (page = 1, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${baseUrl}/api/products?page=${page}`)
      console.log(res.data)
      return { ...res.data }
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
)

// api call
export const queryProducts = createAsyncThunk(
  'products/queryProducts',
  async (input, { rejectWithValue }) => {
    const { keyword, page } = input
    try {
      const res = await axios.get(
        `${baseUrl}/api/products/query?keyword=${keyword}&page=${page}`
      )
      return { ...res.data }
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
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
        state.status = 'products fetched'
        state.products = action.payload.products
        state.page = action.payload.page
        state.pages = action.payload.pages
        state.error = null
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'error fetching products'
        state.error = action.payload.message
      })

    builder
      .addCase(queryProducts.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(queryProducts.fulfilled, (state, action) => {
        state.status = 'products queried'
        state.products = action.payload.products
        state.page = action.payload.page
        state.pages = action.payload.pages
        state.error = null
      })
      .addCase(queryProducts.rejected, (state, action) => {
        state.status = 'error querying products'
        state.error = action.payload.message
      })
  },
})

export const selectProducts = (state) => state.products.products
export const selectPages = (state) => state.products.pages
export const selectProductsStatus = (state) => state.products.status
export const selectProductsError = (state) => state.products.error

export const productsReducer = productsSlice.reducer
