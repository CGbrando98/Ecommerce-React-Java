import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

// intial state before an actions are dispatched
const initialState = {
  product: {},
  status: 'idle', // idle, loading, succeeded, failed
  error: null,
}

// api call
export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (input) => {
    const { token, userId } = input
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const res = await axios.post(
      `http://localhost:8080/api/products`,
      {
        userid: userId,
        name: 'Sample Name',
        image: '/images/sample.jpg',
        description: 'Sample description',
        brand: 'Sample Brand',
        category: 'Sample Category',
        price: 0,
        stock: 0,
        avgrating: 0,
        reviews: 0,
        productReviews: [],
      },
      config
    )
    return { ...res.data }
  }
)

// api call
export const fetchProduct = createAsyncThunk(
  'product/fetchProduct',
  async (productId) => {
    const res = await axios.get(
      `http://localhost:8080/api/products/${productId}`
    )
    // throw new Error('Error testing')
    return { ...res.data }
  }
)

// api call
export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (input) => {
    const { token, productId } = input
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const res = await axios.delete(
      `http://localhost:8080/api/products/${productId}`,
      config
    )
    return { ...res.data }
  }
)

// api call
export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async (input) => {
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
        Authorization: `Bearer ${token}`,
      },
    }
    const res = await axios.put(
      `http://localhost:8080/api/products/${productId}`,
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
        state.status = 'creation error'
        state.error = action.error.message
      })

    builder
      .addCase(fetchProduct.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.status = 'product fetched '
        state.error = null
        state.product = action.payload
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.status = 'fetch error'
        state.error = action.error.message
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
        state.status = 'deletion error'
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
        state.status = 'update Error'
        state.error = action.payload.message
      })
  },
})

export const selectProduct = (state) => state.product.product
export const selectProductStatus = (state) => state.product.status
export const selectProductError = (state) => state.product.error

export const { resetProduct } = productSlice.actions
export const productReducer = productSlice.reducer
