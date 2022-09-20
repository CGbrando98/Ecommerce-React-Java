import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import { Container } from 'react-bootstrap'
import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'

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
              path='/products/:id'
              element={<ProductScreen />}
            />
          </Routes>
        </Container>
      </main>
      <Footer ooter></Footer>
    </Router>
  )
}

export default App
