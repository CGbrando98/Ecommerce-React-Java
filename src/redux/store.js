import { configureStore } from '@reduxjs/toolkit'
import { productsReducer } from './productsSlice'
import { productReducer } from './productSlice'
import { orderReducer } from './orderSlice'
import { userAuthReducer } from './userAuthSlice'
import { userRegisterReducer } from './userRegisterSlice'
import { orderPlacedReducer } from './orderPlacedSlice'
import { ordersPlacedReducer } from './ordersPlacedSlice'
import { usersReducer } from './usersSlice'
import { userReducer } from './userSlice'

export const store = configureStore({
  reducer: {
    products: productsReducer,
    product: productReducer,
    order: orderReducer,
    orderPlaced: orderPlacedReducer,
    ordersPlaced: ordersPlacedReducer,
    user: userReducer,
    userAuth: userAuthReducer,
    userRegister: userRegisterReducer,
    users: usersReducer,
  },
})
