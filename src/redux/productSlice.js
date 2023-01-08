import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import baseUrl from '../config'

// intial state before an actions are dispatched
const initialState = {
  product: {},
  status: 'idle', // idle, loading, succeeded, failed
  error: null,
}

// api call
export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (input, { rejectWithValue }) => {
    const { token, userId } = input
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    try {
      const res = await axios.post(
        `${baseUrl}/api/products`,
        {
          userid: userId,
          name: 'Sample Name',
          image: '/images/sample.jpg',
          description: 'Sample description',
          brand: 'Sample Brand',
          category: 'Sample Category',
          price: 0,
          stock: 0,
        },
        config
      )
      return { ...res.data }
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
)

// api call
export const fetchProduct = createAsyncThunk(
  'product/fetchProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${baseUrl}/api/products/${productId}`)
      return { ...res.data }
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
)

// api call
export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (input, { rejectWithValue }) => {
    const { token, productId } = input
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    try {
      const res = await axios.delete(
        `${baseUrl}/api/products/${productId}`,
        config
      )
      return { ...res.data }
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
)

// api call
export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async (input, { rejectWithValue }) => {
    const {
      token,
      userId,
      productId,
      name,
      image,
      description,
      brand,
      category,
      price,
      stock,
    } = input
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
    try {
      const res = await axios.put(
        `${baseUrl}/api/products/${productId}`,
        {
          userid: userId,
          name,
          image,
          description,
          brand,
          category,
          price,
          stock,
        },
        config
      )
      return { ...res.data }
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
)

// setting state
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    resetProduct: (state, action) => {
      state.status = 'idle'
      state.error = null
      state.product = {}
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.status = 'product created'
        state.error = null
        state.product = action.payload
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = 'error creating product'
        state.error = action.payload.message
      })

    builder
      .addCase(fetchProduct.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.status = 'product fetched'
        state.error = null
        state.product = action.payload
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.status = 'error fetching product'
        state.error = action.payload.message
      })

    builder
      .addCase(deleteProduct.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = 'product deleted'
        state.error = null
        state.product = {}
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = 'error deleting product'
        state.error = action.payload.message
      })

    builder
      .addCase(updateProduct.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = 'product updated'
        state.error = null
        state.product = action.payload
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = 'error updating product'
        state.error = action.payload.message
      })
  },
})

export const selectProduct = (state) => state.product.product
export const selectProductStatus = (state) => state.product.status
export const selectProductError = (state) => state.product.error

export const { resetProduct } = productSlice.actions
export const productReducer = productSlice.reducer
