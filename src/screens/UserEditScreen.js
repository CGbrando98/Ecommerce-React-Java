import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { selectUserAuth } from '../redux/userAuthSlice'
import {
  fetchUserReset,
  fetchUser,
  updateUserAsAdmin,
  selectUser,
  selectUserError,
  selectUserStatus,
} from '../redux/userSlice'

const UserEditScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const params = useParams()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  const userId = params.id
  const { access_token: token } = useSelector(selectUserAuth)

  const userFetchedById = useSelector(selectUser)
  const userFetchedByIdStatus = useSelector(selectUserStatus)
  const userFetchedByIdError = useSelector(selectUserError)

  useEffect(() => {
    if (!userFetchedById.id_user || userFetchedById.id_user != userId) {
      dispatch(fetchUser({ token, userId }))
    } else {
      setUsername(userFetchedById.username)
      setEmail(userFetchedById.email)
      setIsAdmin(userFetchedById.role === 'ROLE_ADMIN' ? true : false)
    }
    if (userFetchedByIdStatus === 'User Updated by Admin') {
      navigate('/admin/users')
      dispatch(fetchUserReset())
    }
  }, [userFetchedById, dispatch])

  const submitHandler = (e) => {
    dispatch(updateUserAsAdmin({ token, userId, username, email, isAdmin }))
  }

  return (
    <>
      <Link
        to='/admin/users'
        className='btn btn-light my-3'
      >
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit User</h1>
        {userFetchedByIdStatus === 'loading' ? (
          <Loader></Loader>
        ) : userFetchedByIdError ? (
          <Message variant='danger'>userFetchedByIdError </Message>
        ) : (
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
            {/* role change */}
            <Form.Group
              controlId='isadmin'
              className='mb-3'
            >
              <Form.Check
                type='checkbox'
                label='Is Admin'
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>

            <Button
              type='submit'
              variant='primary'
            >
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}

export default UserEditScreen
