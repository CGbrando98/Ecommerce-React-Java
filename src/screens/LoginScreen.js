import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import {
  loginUser,
  selectUserAuth,
  selectUserAuthStatus,
  selectUserAuthError,
} from '../redux/userAuthSlice'

const LoginScreen = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // location.search is the old method of getting query string params
  const [searchParams, setSearchParams] = useSearchParams()
  const redirect = searchParams.get('redirect')
    ? '/' + searchParams.get('redirect')
    : '/'
  const user = useSelector(selectUserAuth)
  const userId = user.userInfo ? user.userInfo.id_user : null
  const userStatus = useSelector(selectUserAuthStatus)
  const userError = useSelector(selectUserAuthError)

  // page redirect is handled by react
  useEffect(() => {
    // if user exists/is signed in, redirect them
    if (userId) {
      navigate(redirect)
    }
  }, [navigate, user, redirect])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(loginUser({ username, password }))
  }
  return (
    <FormContainer>
      <h1>Sign In</h1>
      {userError && <Message variant='danger'>{userError}</Message>}
      {userStatus === 'loading' && <Loader></Loader>}
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
        <Button
          type='submit'
          variant='primary'
        >
          Sign In
        </Button>
      </Form>
      <Row className='py-3'>
        <Col>
          New Customer?{' '}
          {/* <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}> */}
          <Link to={'/register'}>Register</Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default LoginScreen
