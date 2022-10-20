import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Carousel, Image } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from './Loader'
import Message from './Message'
import {
  fetchTopProducts,
  selectTopProducts,
  selectTopProductsStatus,
  selectTopProductsError,
} from '../redux/topProductsSlice'

const ProductCarousel = () => {
  const dispatch = useDispatch()
  const topProducts = useSelector(selectTopProducts)
  const topProductsStatus = useSelector(selectTopProductsStatus)
  const topProductsError = useSelector(selectTopProductsError)

  useEffect(() => {
    dispatch(fetchTopProducts())
  }, [dispatch])

  return selectTopProductsStatus === 'loading' ? (
    <Loader />
  ) : topProductsError ? (
    <Message variant='danger'>{topProductsError}</Message>
  ) : (
    <Carousel
      pause='hover'
      className='bg-dark'
    >
      {topProducts.map((p) => (
        <Carousel.Item key={p.id_product}>
          <Link
            to={`/products/${p.id_product}`}
            className='d-flex text-decoration-none'
          >
            <Image
              className='w-50'
              src={p.image}
              alt={p.name}
              fluid
            />
            <Carousel.Caption className='position-static px-5 w-50 align-self-center'>
              <h2 className='text-white w-100 px-5'>
                {p.name} (${p.price})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default ProductCarousel
