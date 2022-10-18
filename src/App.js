import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import { Container } from 'react-bootstrap'
import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'
import CartScreen from './screens/CartScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import ProfileScreen from './screens/ProfileScreen'
import ShippingScreen from './screens/ShippingScreen'
import PaymentScreen from './screens/PaymentScreen'
import PlaceOrderScreen from './screens/PlaceOrderScreen'
import OrderScreen from './screens/OrderScreen'
import UsersScreen from './screens/UsersScreen'
import UserEditScreen from './screens/UserEditScreen'
import ProductsScreen from './screens/ProductsScreen'
import ProductEditScreen from './screens/ProductEditScreen'
import OrdersScreen from './screens/OrdersScreen'

const App = () => {
  return (
    <Router>
      <Header></Header>
      <main className='py-3'>
        <Container>
          <Routes>
            <Route
              path='/'
              element={<HomeScreen />}
            />
            <Route
              path='/register'
              element={<RegisterScreen />}
            />
            <Route
              path='/login'
              element={<LoginScreen />}
            />
            <Route
              path='/profile'
              element={<ProfileScreen />}
            />
            <Route
              path='/products/:id'
              element={<ProductScreen />}
            />
            <Route
              path='/cart'
              element={<CartScreen />}
            >
              <Route
                path=':id'
                element={<CartScreen />}
              />
            </Route>
            <Route
              path='/shipping'
              element={<ShippingScreen />}
            />
            <Route
              path='/payment'
              element={<PaymentScreen />}
            />
            <Route
              path='/placeorder'
              element={<PlaceOrderScreen />}
            />
            <Route
              path='/orders'
              element={<OrderScreen />}
            >
              <Route
                path=':id'
                element={<OrderScreen />}
              />
            </Route>
            <Route
              path='/admin/users'
              element={<UsersScreen />}
            />
            <Route
              path='/admin/users/:id/edit'
              element={<UserEditScreen />}
            />
            <Route
              path='/admin/products'
              element={<ProductsScreen />}
            />
            <Route
              path='/admin/products/:pageNumber'
              element={<ProductsScreen />}
            />
            <Route
              path='/admin/products/:id/edit'
              element={<ProductEditScreen />}
            />
            <Route
              path='/admin/orders'
              element={<OrdersScreen />}
            />
            <Route
              path='/search/:keyword'
              element={<HomeScreen />}
            />
            <Route
              path='/page/:pageNumber'
              element={<HomeScreen />}
            />
            <Route
              path='/search/:keyword/page/:pageNumber'
              element={<HomeScreen />}
            />
          </Routes>
        </Container>
      </main>
      <Footer></Footer>
    </Router>
  )
}

export default App
