import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate, Link } from 'react-router-dom'
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
import { selectUserAuth } from '../redux/userAuthSlice'
import {
  resetReview,
  createReview,
  selectReviewStatus,
  selectReviewError,
} from '../redux/reviewSlice'

const ProductScreen = () => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  // default qty to add to cart is 1
  const [qty, setQty] = useState(1)

  const { id } = useParams()
  // for submitting forms
  const navigate = useNavigate()
  // for firing action
  const dispatch = useDispatch()
  // getting information from global state
  const product = useSelector(selectProduct)
  const reviews = product.productReviews ? product.productReviews : []
  const productStatus = useSelector(selectProductStatus)
  const productError = useSelector(selectProductError)

  const user = useSelector(selectUserAuth)
  const token = user.access_token
  const userId = user.userInfo ? user.userInfo.id_user : null
  const role = user.userInfo ? user.userInfo.role : null

  const reviewStatus = useSelector(selectReviewStatus)
  const reviewError = useSelector(selectReviewError)

  useEffect(() => {
    // fire fetchProducts action
    dispatch(fetchProduct(id))

    if (reviewStatus === 'Review Submitted') {
      setRating(0)
      setComment('')
      dispatch(resetReview())
    }
  }, [dispatch, id, reviewStatus])

  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}`)
  }

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(createReview({ token, id, userId, rating, comment }))
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
        <>
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
                      <Col>
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </Col>
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
          <Row>
            <Col md={6}>
              <h2>Reviews</h2>
              {reviews.length === 0 && <Message>No Reviews</Message>}
              <ListGroup variant='flush'>
                {reviews.map((review) => (
                  <ListGroup.Item key={review.id_review}>
                    <strong>
                      {review.reviewUser
                        ? review.reviewUser.username
                        : 'Unknown User'}
                    </strong>
                    <Rating value={review.rating}></Rating>
                    <p>{review.reviewCreatedDate}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}

                <ListGroup.Item>
                  <h2>Write a Customer Review</h2>
                  {/* review success banner has no time to show up */}
                  {reviewStatus === 'Review Submitted' && (
                    <Message variant='success'>
                      Review submitted successfully
                    </Message>
                  )}
                  {reviewStatus === 'loading' && <Loader />}
                  {reviewError && (
                    <Message variant='danger'>{reviewError}</Message>
                  )}
                  {userId ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId='rating'>
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as='select'
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value=''>Select...</option>
                          <option value='1'>1 - Poor</option>
                          <option value='2'>2 - Fair</option>
                          <option value='3'>3 - Good</option>
                          <option value='4'>4 - Very Good</option>
                          <option value='5'>5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId='comment'>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as='textarea'
                          row='3'
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        type='submit'
                        variant='primary'
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to='/login'>sign in</Link> to write a review
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
        // end of render product
      )}
    </>
  )
}

export default ProductScreen
