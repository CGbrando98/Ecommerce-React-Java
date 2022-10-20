import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import baseUrl from '../config'

const initialState = localStorage.getItem('order')
  ? { ...JSON.parse(localStorage.getItem('order')), status: 'idle' }
  : {
      id_order: null,
      cart: [],
      shippingDetails: {
        address: null,
        city: null,
        postalCode: null,
        country: null,
      },
      paymentDetails: {
        paypalId: null,
        paymentStatus: null,
        paymentUpdateTime: null,
        paymentEmail: null,
      },
      paymentMethod: null,
      itemsPrice: null,
      taxPrice: null,
      shippingPrice: null,
      totalPrice: null,
      isPaid: false,
      paidAt: null,
      isDelivered: false,
      deliveredAt: null,

      status: 'idle', // idle, loading, succeeded, failed
      error: null,
    }

// api call to get products in the cartScreen
export const addToCart = createAsyncThunk('cart/addToCart', async (input) => {
  const { productId, productQty } = input
  const res = await axios.get(`${baseUrl}/api/products/${productId}`)
  const { data } = res
  // throw new Error('Error testing')
  return {
    product: data.id_product,
    name: data.name,
    image: data.image,
    price: data.price,
    stock: data.stock,
    qty: productQty,
  }
})

// api call to send order
export const CreateAndSendOrder = createAsyncThunk(
  'order/sendOrder',
  async (input) => {
    const {
      token,
      order,
      userId,
      totalPrice,
      shippingPrice,
      taxPrice,
      itemsPrice,
    } = input

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
    const res = await axios.post(
      `${baseUrl}/api/orders`,
      {
        // the user is already in the DB while the other nested objects aren't
        userid: userId,
        items: order.cart,
        shipping: {
          ...order.shippingDetails,
          postal: order.shippingDetails.postalCode,
        },
        payment: { ...order.paymentDetails },
        paymentmethod: order.paymentMethod,
        itemsprice: itemsPrice,
        taxprice: taxPrice,
        shippingprice: shippingPrice,
        totalprice: totalPrice,
        ispaid: order.isPaid,
        paidat: order.paidAt,
        isdelivered: order.isDelivered,
        deliveredat: order.deliveredAt,
      },
      config
    )
    return { ...res.data }
  }
)

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    removeFromCart: (state, action) => {
      const returnedState = {
        ...state,
        cart: state.cart.filter((x) => x.product !== action.payload),
      }
      localStorage.setItem('order', JSON.stringify(returnedState))
      return returnedState
    },

    addShippingDetails: (state, action) => {
      const returnedState = {
        ...state,
        shippingDetails: {
          ...state.shippingDetails,
          address: action.payload.address,
          city: action.payload.city,
          postalCode: action.payload.postalCode,
          country: action.payload.country,
        },
      }
      localStorage.setItem('order', JSON.stringify(returnedState))
      return returnedState
    },

    addPaymentMethod: (state, action) => {
      const returnedState = {
        ...state,
        paymentMethod: action.payload,
      }
      localStorage.setItem('order', JSON.stringify(returnedState))
      return returnedState
    },

    resetOrder: (state, action) => {
      const returnedState = {
        ...state,
        status: 'idle',
        id_order: null,
        cart: [],
        itemsPrice: null,
        taxPrice: null,
        shippingPrice: null,
        totalPrice: null,
      }
      localStorage.setItem('order', JSON.stringify(returnedState))
      return returnedState
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const item = action.payload
        const existsItem = state.cart.find((x) => x.product === item.product)
        let returnedState = {}
        if (existsItem) {
          returnedState = {
            ...state,
            cart: state.cart.map((x) =>
              x.product === existsItem.product ? item : x
            ),
            status: 'succeeded',
          }
        } else {
          returnedState = {
            ...state,
            cart: [...state.cart, item],
            status: 'succeeded',
          }
        }
        localStorage.setItem('order', JSON.stringify(returnedState))
        return returnedState
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

    builder
      .addCase(CreateAndSendOrder.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(CreateAndSendOrder.fulfilled, (state, action) => {
        const returnedState = {
          ...state,
          status: 'order sent successfully',
          error: null,
          id_order: action.payload.id_order,
          taxPrice: action.payload.taxprice,
          shippingPrice: action.payload.shippingprice,
          totalPrice: action.payload.totalprice,
          itemsPrice: action.payload.itemsprice,
        }
        localStorage.setItem('order', JSON.stringify(returnedState))

        return returnedState
      })
      .addCase(CreateAndSendOrder.rejected, (state, action) => {
        state.status = 'order rejected'
        state.error = action.error.message
      })
  },
})

// maybe this state should be called order
export const selectOrder = (state) => state.order
export const selectOrderStatus = (state) => state.order.status
export const selectCart = (state) => state.order.cart
export const selectShippingDetails = (state) => state.order.shippingDetails
export const selectPaymentMethod = (state) => state.order.paymentMethod
export const {
  removeFromCart,
  addShippingDetails,
  addPaymentDetails,
  addPaymentMethod,
  resetOrder,
} = orderSlice.actions
export const orderReducer = orderSlice.reducer
