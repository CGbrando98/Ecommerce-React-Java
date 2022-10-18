import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import ProductCarousel from '../components/ProductCarousel'
import Product from '../components/Product'
import Paginate from '../components/Paginate'
import {
  queryProducts,
  fetchProducts,
  selectProducts,
  selectPages,
  selectProductsStatus,
  selectProductsError,
} from '../redux/productsSlice'

const HomeScreen = () => {
  const { keyword, pageNumber } = useParams()
  const page = pageNumber ? pageNumber : 1

  const dispatch = useDispatch()
  const products = useSelector(selectProducts)
  const pages = useSelector(selectPages)
  const productsStatus = useSelector(selectProductsStatus)
  const productsError = useSelector(selectProductsError)

  useEffect(() => {
    if (keyword) {
      dispatch(queryProducts({ keyword, page }))
    } else {
      dispatch(fetchProducts(page))
    }
  }, [dispatch, keyword, page])
  return (
    <>
      {!keyword && <ProductCarousel></ProductCarousel>}
      <h1 className='mt-5'>Latest Products</h1>
      {productsStatus === 'loading' ? (
        <Loader></Loader>
      ) : productsError ? (
        <Message variant='danger'>{productsError}</Message>
      ) : (
        // display products if no error is found and not loading
        <>
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
          {/* end of render products */}
          <Row>
            <Paginate
              pages={pages}
              page={page}
              keyword={keyword ? keyword : ''}
            ></Paginate>
          </Row>
        </>
      )}
    </>
  )
}

export default HomeScreen
