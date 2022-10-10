import React, { useState, useEffect } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import { selectUserAuth } from '../redux/userAuthSlice'
import { addPaymentMethod, selectShippingDetails } from '../redux/orderSlice'
import { useNavigate } from 'react-router-dom'
import CheckoutSteps from '../components/CheckoutSteps'

const PaymentScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector(selectUserAuth)
  const userId = user.userInfo ? user.userInfo.id_user : null
  const shippingAddress = useSelector(selectShippingDetails)

  const [paymentMethod, setPaymentMethod] = useState('Paypal')

  useEffect(() => {
    if (!shippingAddress.address && !shippingAddress.postalCode) {
      navigate('/shipping')
    }
    if (!userId) {
      navigate('/login?redirect=placeorder')
    }
  }, [navigate, shippingAddress, user])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(addPaymentMethod(paymentMethod))
    navigate('/placeorder')
  }

  return (
    <FormContainer>
      <CheckoutSteps
        step1
        step2
        step3
      ></CheckoutSteps>
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='my-3'>
          <Form.Label as='legend'>Select Method</Form.Label>

          <Col>
            <Form.Check
              className='ms-3'
              type='radio'
              label='Paypal or Credit Card'
              id='Paypal'
              name='paymentMethod'
              value='PayPal'
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>
        <Button
          type='submit'
          variant='primary'
        >
          Continue
        </Button>
      </Form>
    </FormContainer>
  )
}

export default PaymentScreen
