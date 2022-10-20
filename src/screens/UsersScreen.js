import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
  fetchUsers,
  selectUsers,
  selectUsersStatus,
  selectUsersError,
} from '../redux/usersSlice'
import {
  deleteUser,
  selectUser,
  selectUserStatus,
  selectUserError,
} from '../redux/userSlice'
import { selectUserAuth } from '../redux/userAuthSlice'

const UsersScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector(selectUserAuth)
  const token = user.access_token
  const role = user.userInfo ? user.userInfo.role : null
  const users = useSelector(selectUsers)
  const usersStatus = useSelector(selectUsersStatus)
  const usersError = useSelector(selectUsersError)

  const userStatus = useSelector(selectUserStatus)
  const userError = useSelector(selectUserError)

  useEffect(() => {
    if (user.userInfo && role === 'ROLE_ADMIN') {
      dispatch(fetchUsers(token))
    } else {
      navigate('/login')
    }
  }, [dispatch, navigate, userStatus])

  const deleteHandler = (userId) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteUser({ userId, token }))
    }
  }

  return (
    <>
      <h1>Users</h1>
      {usersStatus === 'loading' ? (
        <Loader></Loader>
      ) : usersError ? (
        <Message variant='danger'>{usersError}</Message>
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
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Admin</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id_user}>
                <td>{u.id_user}</td>
                <td>{u.username}</td>
                <td>
                  <a href={`mailto:${u.email}`}>{u.email}</a>
                </td>
                <td>
                  {u.role === 'ROLE_ADMIN' ? (
                    <i
                      className='fas fa-check'
                      style={{ color: 'green' }}
                    ></i>
                  ) : (
                    <i
                      className='fas fa-times'
                      style={{ color: 'red' }}
                    ></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/users/${u.id_user}/edit`}>
                    <Button
                      variant='light'
                      className='btn-sm'
                    >
                      <i className='fas fa-edit'></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant='danger'
                    className='btn-sm'
                    onClick={() => deleteHandler(u.id_user)}
                  >
                    <i className='fas fa-trash'></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default UsersScreen
