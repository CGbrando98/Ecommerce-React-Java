import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { selectUserAuth } from '../redux/userAuthSlice'
import {
  getOrdersPlaced,
  selectOrdersPlaced,
  selectOrdersPlacedStatus,
  selectOrdersPlacedError,
} from '../redux/ordersPlacedSlice'

const OrdersScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector(selectUserAuth)
  const token = user.access_token
  const userId = user.userInfo ? user.userInfo.id_user : null
  const role = user.userInfo ? user.userInfo.role : null

  const ordersPlaced = useSelector(selectOrdersPlaced)
  const ordersPlacedStatus = useSelector(selectOrdersPlacedStatus)
  const ordersPlacedError = useSelector(selectOrdersPlacedError)

  useEffect(() => {
    if (user.userInfo && role === 'ROLE_ADMIN') {
      dispatch(getOrdersPlaced(token))
    } else {
      navigate('/login')
    }
  }, [dispatch, navigate, user])

  return (
    <>
      <h1>Users</h1>
      {ordersPlacedStatus === 'loading' ? (
        <Loader></Loader>
      ) : ordersPlacedError ? (
        <Message variant='danger'>{ordersPlacedError}</Message>
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
              <th>User</th>
              <th>Date</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Delivered</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {ordersPlaced.map((o) => (
              <tr key={o.id_order}>
                <td>{o.id_order}</td>
                <td>{o.user && o.user.username}</td>
                <td>{o.orderCreatedDate}</td>
                <td>${o.totalprice}</td>
                <td>
                  {o.ispaid ? (
                    o.paidat
                  ) : (
                    <i
                      className='fas fa-times'
                      style={{ color: 'red' }}
                    ></i>
                  )}
                </td>
                <td>
                  {o.isdelivered ? (
                    o.deliveredat
                  ) : (
                    <i
                      className='fas fa-times'
                      style={{ color: 'red' }}
                    ></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/orders/${o.id_order}`}>
                    <Button
                      variant='light'
                      className='btn-sm'
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
    </>
  )
}

export default OrdersScreen
