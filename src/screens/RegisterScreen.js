import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { selectUserAuth } from '../redux/userAuthSlice'
import {
  registerUser,
  selectUserRegisterStatus,
  selectUserRegisterError,
} from '../redux/userRegisterSlice'
import axios from 'axios'

const RegisterScreen = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // why do we have this
  const [message, setMessage] = useState(null)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  // location.search is the old method of getting query string params
  const [searchParams, setSearchParams] = useSearchParams()
  // const redirect = searchParams.get('redirect')
  //   ? searchParams.get('redirect')
  //   : '/'
  const user = useSelector(selectUserAuth)
  const userId = user.userInfo ? user.userInfo.id_user : null

  const userRegStatus = useSelector(selectUserRegisterStatus)
  const userRegError = useSelector(selectUserRegisterError)

  // page redirect is handled by react

  // useEffect(() => {
  // if user exists/is signed in, redirect them
  // if (userId || userRegStatus === 'Registered') {
  // navigate('/login')
  // }
  // }, [navigate, userRegStatus, user])

  const submitHandler = (e) => {
    e.preventDefault()
    // post to register
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
    } else {
      dispatch(registerUser({ username, email, password }))
      // if (userRegStatus === 'Registered') {
      //   navigate('/login')
      // }
    }
  }
  return (
    <FormContainer>
      <h1>Sign Up</h1>
      {message && <Message variant='danger'>{message}</Message>}
      {userRegError && <Message variant='danger'>{userRegError}</Message>}
      {userRegStatus === 'loading' && <Loader></Loader>}
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
          Register
        </Button>
      </Form>
      <Row className='py-3'>
        <Col>
          Existing Customer?{' '}
          {/* <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}> */}
          <Link to={'/login'}>Login</Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default RegisterScreen
