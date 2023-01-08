import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col, Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
  logoutUser,
  selectUserAuth,
  selectUserAuthStatus,
  selectUserAuthError,
  updateUser,
  newAccessToken,
} from '../redux/userAuthSlice'
import {
  resetOrdersPlaced,
  getOrdersPlacedByUserId,
  selectOrdersPlaced,
  selectOrdersPlacedStatus,
  selectOrdersPlacedError,
} from '../redux/ordersPlacedSlice'
import { resetUsers } from '../redux/usersSlice'
import tokenCheck from '../tokenExchange'

const ProfileScreen = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // message if passwords are not the same
  const [message, setMessage] = useState(null)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  // location.search is the old method of getting query string params
  const [searchParams, setSearchParams] = useSearchParams()

  const user = useSelector(selectUserAuth)
  const userStatus = useSelector(selectUserAuthStatus)
  const userError = useSelector(selectUserAuthError)
  const userId = user.userInfo ? user.userInfo.id_user : null
  const token = user ? user.access_token : null

  const refreshToken = user ? user.refresh_token : null

  const ordersPlaced = useSelector(selectOrdersPlaced)
  const ordersPlacedStatus = useSelector(selectOrdersPlacedStatus)
  const ordersPlacedError = useSelector(selectOrdersPlacedError)

  useEffect(() => {
    // if user isn't signed in, redirect them
    if (!userId) {
      navigate('/login')
    } else if (
      ordersPlacedError === null ||
      userStatus === 'new access token obtained'
    ) {
      dispatch(getOrdersPlacedByUserId({ token, userId }))
      setUsername(user.userInfo.username)
      setEmail(user.userInfo.email)
    }
    tokenCheck(dispatch, userId, ordersPlacedError, userError, refreshToken)
  }, [dispatch, navigate, user, token, ordersPlacedError, userError])

  const submitHandler = (e) => {
    e.preventDefault()
    // post to register
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
    } else {
      dispatch(updateUser({ username, password, email, userId, token }))
    }
  }
  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        {message && <Message variant='danger'>{message}</Message>}
        <Form onSubmit={submitHandler}>
          {/* username input */}
          <Form.Group
            controlId='username'
            className='mb-3'
          >
            <Form.Label>Username</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            ></Form.Control>
          </Form.Group>
          {/* email input */}
          <Form.Group
            controlId='email'
            className='mb-3'
          >
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter Email Address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          {/* password input */}
          <Form.Group
            controlId='password'
            className='mb-3'
          >
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          {/* confirm password input */}
          <Form.Group
            controlId='confirmPassword'
            className='mb-3'
          >
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Confirm Password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button
            type='submit'
            variant='primary'
          >
            Update
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
        {ordersPlacedStatus === 'loading' ? (
          <Loader></Loader>
        ) : ordersPlacedError ? (
          <>
            <Message variant='danger'>{ordersPlacedError}</Message>
            {userError && <Message variant='danger'>{userError}</Message>}
          </>
        ) : (
          <Table
            striped
            bordered
            hover
            responsive
            className='table-sm'
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Delivered</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {ordersPlaced.map((order) => (
                <tr key={order.id_order}>
                  <td>{order.id_order}</td>
                  <td>{order.orderCreatedDate.substring(0, 10)}</td>
                  <td>{order.totalprice}</td>
                  <td>
                    {order.ispaid ? (
                      <>
                        {order.paidat.substring(0, 10)}{' '}
                        {order.paidat.substring(11, 16)}
                      </>
                    ) : (
                      <i
                        className='fas fa-times'
                        style={{ color: 'red' }}
                      ></i>
                    )}
                  </td>
                  <td>
                    {order.isdelivered ? (
                      <>
                        {order.deliveredat.substring(0, 10)}{' '}
                        {order.deliveredat.substring(11, 16)}
                      </>
                    ) : (
                      <i
                        className='fas fa-times'
                        style={{ color: 'red' }}
                      ></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/orders/${order.id_order}`}>
                      <Button
                        className='btn-sm'
                        variant='light'
                      >
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  )
}

export default ProfileScreen
