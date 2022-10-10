import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
// import products from '../products'
// import axios from 'axios'
import Product from '../components/Product'
import {
  fetchProducts,
  selectProducts,
  selectProductsStatus,
  selectProductsError,
} from '../redux/productsSlice'

const HomeScreen = () => {
  // const [products, setProducts] = useState([])
  const dispatch = useDispatch()
  const products = useSelector(selectProducts)
  const productsStatus = useSelector(selectProductsStatus)
  const productsError = useSelector(selectProductsError)

  useEffect(() => {
    dispatch(fetchProducts())
    // const fetchProducts = async () => {
    //   const res = await axios.get('http://localhost:8080/api/products')
    //   setProducts(res.data)
    // }
    // fetchProducts()
    // eslint-disable-next-line
  }, [dispatch])
  return (
    <>
      <h1>Latest Products</h1>
      {productsStatus === 'loading' ? (
        <Loader></Loader>
      ) : productsError ? (
        <Message variant='danger'>{productsError}</Message>
      ) : (
        // display products if no error is found and not loading
        <Row>
          {products.map((product) => (
            <Col
              key={product.id_product}
              sm={12}
              md={6}
              lg={4}
              xl={3}
            >
              <Product product={product}></Product>
            </Col>
          ))}
        </Row>
        // end of render products
      )}
    </>
  )
}

export default HomeScreen
