import React, { useState, useEffect } from 'react'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { PayPalButton } from 'react-paypal-button-v2'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
  getOrderPlacedById,
  selectOrderPlaced,
  selectOrderPlacedStatus,
  selectOrderPlacedError,
} from '../redux/orderPlacedSlice'
import { selectUserAuth } from '../redux/userAuthSlice'
import axios from 'axios'

const OrderScreen = () => {
  const [sdkReady, setSdkReady] = useState(false)

  const { id } = useParams()
  const orderId = id
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector(selectUserAuth)
  const token = user.access_token

  const orderPlaced = useSelector(selectOrderPlaced)
  // fix warning on this page
  const { totalprice, taxprice, shippingprice, itemsprice } = orderPlaced
  const shipping = orderPlaced.shipping ? orderPlaced.shipping : {}
  const payment = orderPlaced.payment ? orderPlaced.payment : {}
  const items = orderPlaced.items ? orderPlaced.items : []
  const orderUser = orderPlaced.user ? orderPlaced.user : {}

  const orderPlacedStatus = useSelector(selectOrderPlacedStatus)
  const orderPlacedError = useSelector(selectOrderPlacedError)

  useEffect(() => {
    const addPaypalScript = async () => {
      const { data } = await axios.get(
        'http://localhost:8080/api/config/paypal'
      )
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://www.paypal.com/sdk/js?client-id=${data}`
      script.async = true
      script.onload = () => setSdkReady(true)
      document.body.appendChild(script)
    }
    dispatch(getOrderPlacedById({ token, orderId }))
    if (!orderPlaced.ispaid) {
      addPaypalScript()
    } else {
      setSdkReady(true)
    }
  }, [dispatch, token, orderId])

  const successPaymentHandler = () => {
    console.log('paid')
  }

  return (
    <>
      {orderPlacedStatus === 'loading' ? (
        <Loader></Loader>
      ) : orderPlacedError ? (
        <Message variant='danger'>{orderPlacedError}</Message>
      ) : (
        <>
          <h1>Order {orderPlaced.id_order}</h1>
          <Row>
            <Col md={8}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h2>Shipping</h2>
                  <p>
                    <strong>Name: </strong>
                    {orderUser.username}
                  </p>

                  <p>
                    <strong>Email: </strong>
                    <a href={`mailto:${orderUser.email}`}>{orderUser.email}</a>
                  </p>

                  <p>
                    <strong>Address: </strong>
                    {shipping.address}, {shipping.city}, {shipping.country},{' '}
                    {shipping.postal}
                  </p>
                  {orderPlaced.isdelivered ? (
                    <Message variant='success'>
                      Delivered on {orderPlaced.deliveredat}
                    </Message>
                  ) : (
                    <Message variant='danger'>Not Delivered</Message>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <h2>Payment Method</h2>
                  <p>
                    <strong>Method: </strong>
                    {orderPlaced.paymentmethod}
                  </p>
                  {orderPlaced.ispaid ? (
                    <Message variant='success'>
                      Paid on {orderPlaced.paidat}
                    </Message>
                  ) : (
                    <Message variant='danger'>Not Paid</Message>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <h2>Order Items</h2>
                  {items.length === 0 ? (
                    <Message>Your cart is empty</Message>
                  ) : (
                    <ListGroup variant='flush'>
                      {items.map((item, index) => (
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
                              <Link to={`/product/${item.id_item}`}>
                                {item.name}
                              </Link>
                            </Col>
                            <Col md={4}>
                              {item.qty} x ${item.itemProduct.price} = $
                              {Number(
                                (item.qty * item.itemProduct.price).toFixed(2)
                              )}
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
                      <Col>{itemsprice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Shipping</Col>
                      <Col>${shippingprice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Tax</Col>
                      <Col>${taxprice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Total</Col>
                      <Col>${totalprice}</Col>
                    </Row>
                  </ListGroup.Item>
                  {!orderPlaced.ispaid && (
                    <ListGroup.Item>
                      <PayPalButton
                        amount={totalprice}
                        onSuccess={successPaymentHandler}
                      />
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

export default OrderScreen
