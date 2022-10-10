import React, { useState, useEffect } from 'react'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import {
  selectOrder,
  selectCart,
  selectShippingDetails,
  selectPaymentMethod,
  createOrder,
  sendOrder,
} from '../redux/orderSlice'
import { selectUserAuth } from '../redux/userAuthSlice'

const PlaceOrderScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector(selectUserAuth)
  const userId = user.userInfo ? user.userInfo.id_user : null
  const token = user.access_token

  const order = useSelector(selectOrder)
  const orderId = order ? order.id_order : null
  const cart = useSelector(selectCart)
  const shippingAddress = useSelector(selectShippingDetails)
  const paymentMethod = useSelector(selectPaymentMethod)

  // calculate prices
  const itemsPrice = Number(
    cart.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
  )
  const shippingPrice = itemsPrice > 100 ? 0 : 24.99
  const taxPrice = Number((itemsPrice * 0.3).toFixed(2))
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2))

  useEffect(() => {
    if (!paymentMethod) {
      navigate('/payment')
    }
    if (!userId) {
      navigate(`/login?redirect=order/${orderId}`)
    }
  }, [navigate, paymentMethod, user])

  const placeOrderHandler = () => {
    dispatch(createOrder({ totalPrice, shippingPrice, taxPrice, itemsPrice }))
    dispatch(sendOrder({ order, token, userId }))
    // this doesnt work, its fired before dom reload
    navigate(`/orders/${orderId}`)
  }
  return (
    <>
      <CheckoutSteps
        step1
        step2
        step3
        step4
      ></CheckoutSteps>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong>
                {shippingAddress.address}, {shippingAddress.city},{' '}
                {shippingAddress.country}, {shippingAddress.postalCode},
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {paymentMethod}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          ></Image>
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = $
                          {Number((item.qty * item.price).toFixed(2))}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        {/* Summary */}
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>{itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type='button'
                  className='w-100'
                  disabled={cart.length === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default PlaceOrderScreen
