import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart, removeFromCart, selectCart } from '../redux/orderSlice'

const CartScreen = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const productQty = Number(searchParams.get('qty'))
  const params = useParams()
  const productId = params.id

  const dispatch = useDispatch()
  const cart = useSelector(selectCart)
  const navigate = useNavigate()

  const removeFromCartHandler = (productId) => {
    dispatch(removeFromCart(productId))
  }

  const checkoutHandler = () => {
    navigate('/login?redirect=shipping')
  }

  useEffect(() => {
    if (productId) {
      dispatch(addToCart({ productId, productQty }))
    }
  }, [dispatch, productId, productQty])

  return (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {cart.length === 0 ? (
          <Message>
            Your cart is empty <Link to='/'>Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant='flush'>
            {cart.map((item) => (
              <ListGroup.Item key={item.product}>
                <Row>
                  <Col md={2}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fluid
                      rounded
                    ></Image>
                  </Col>
                  <Col md={3}>
                    <Link to={`/products/${item.product}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>${item.price}</Col>
                  <Col md={2}>
                    <Form.Select
                      value={item.qty}
                      onChange={(e) => {
                        dispatch(
                          addToCart({
                            productId: item.product,
                            productQty: Number(e.target.value),
                          })
                        )
                      }}
                    >
                      {/* display options for qty matching stock */}
                      {/* x is the index  */}
                      {[...Array(item.stock).keys()].map((x) => (
                        <option
                          key={x + 1}
                          value={x + 1}
                        >
                          {x + 1}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={2}>
                    <Button
                      type='button'
                      variant='light'
                      onClick={() => removeFromCartHandler(item.product)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>
                Subtotal (
                {cart.reduce((acc, item) => acc + Number(item.qty), 0)}) items
              </h2>
              $
              {cart
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type='button'
                className='btn w-100'
                disabled={cart.length === 0}
                onClick={checkoutHandler}
              >
                Proceed to Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  )
}

export default CartScreen
