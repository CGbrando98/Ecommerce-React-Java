import { configureStore } from '@reduxjs/toolkit'
import { productsReducer } from './productsSlice'
import { productReducer } from './productSlice'
import { orderReducer } from './orderSlice'
import { userAuthReducer } from './userAuthSlice'
import { userRegisterReducer } from './userRegisterSlice'
import { orderPlacedReducer } from './orderPlacedSlice'

export const store = configureStore({
  reducer: {
    products: productsReducer,
    product: productReducer,
    order: orderReducer,
    orderPlaced: orderPlacedReducer,
    userAuth: userAuthReducer,
    userRegister: userRegisterReducer,
  },
})
