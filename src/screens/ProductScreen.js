import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap'
import Rating from '../components/Rating'
import {
  fetchProduct,
  selectProduct,
  selectProductStatus,
  selectProductError,
} from '../redux/productSlice'

const ProductScreen = () => {
  // default qty to add to cart is 1
  const [qty, setQty] = useState(1)

  const { id } = useParams()
  // for submitting forms
  const navigate = useNavigate()
  // for firing action
  const dispatch = useDispatch()
  // getting information from global state
  const product = useSelector(selectProduct)
  const productStatus = useSelector(selectProductStatus)
  const productError = useSelector(selectProductError)

  useEffect(() => {
    // fire fetchProducts action
    dispatch(fetchProduct(id))
    // eslint-disable-next-line
  }, [dispatch, id])

  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}`)
  }

  return (
    <>
      <LinkContainer to='/'>
        <Button
          variant='dark'
          className='my-3'
        >
          Go Back
        </Button>
      </LinkContainer>

      {productStatus === 'loading' ? (
        <Loader></Loader>
      ) : productError ? (
        <Message variant='danger'>{productError}</Message>
      ) : (
        // display product if no error is found and not loading
        <Row>
          <Col md={6}>
            <Image
              src={product.image}
              alt={product.name}
              fluid
            ></Image>
          </Col>
          <Col md={3}>
            {/* flush takes away border of the ul*/}
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>

              <ListGroup.Item>
                <Rating
                  value={product.avgrating}
                  text={`${product.reviews} reviews`}
                />
              </ListGroup.Item>

              <ListGroup.Item>Price: ${product.price}</ListGroup.Item>

              <ListGroup.Item>
                Description: {product.description}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <Row>
                    <Col> Price:</Col>
                    <Col>
                      <strong>${product.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {/* the qty will be managed in component state */}
                {product.stock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col> Qty:</Col>
                      <Col>
                        <Form.Select
                          value={qty}
                          onChange={(e) => setQty(e.target.value)}
                        >
                          {/* display options for qty matching stock */}
                          {/* x is the index  */}
                          {[...Array(product.stock).keys()].map((x) => (
                            <option
                              key={x + 1}
                              value={x + 1}
                            >
                              {x + 1}
                            </option>
                          ))}
                        </Form.Select>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}

                <ListGroup.Item>
                  <Row>
                    <Col> Status:</Col>
                    <Col>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Button
                    onClick={addToCartHandler}
                    className='btn w-100'
                    type='button'
                    disabled={product.stock === 0}
                  >
                    Add to Cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
        // end of render product
      )}
    </>
  )
}

export default ProductScreen
