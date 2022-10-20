import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import { selectUserAuth } from '../redux/userAuthSlice'
import { addShippingDetails, selectShippingDetails } from '../redux/orderSlice'
import { useNavigate } from 'react-router-dom'
import CheckoutSteps from '../components/CheckoutSteps'

const ShippingScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector(selectUserAuth)
  const userId = user.userInfo ? user.userInfo.id_user : null
  const shippingAddress = useSelector(selectShippingDetails)

  const [address, setAddress] = useState(shippingAddress.address)
  const [city, setCity] = useState(shippingAddress.city)
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
  const [country, setCountry] = useState(shippingAddress.country)

  useEffect(() => {
    if (!userId) {
      navigate('/login?redirect=payment')
    }
  }, [navigate, user])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(addShippingDetails({ address, city, postalCode, country }))
    navigate('/payment')
  }

  return (
    <FormContainer>
      <CheckoutSteps
        step1
        step2
      ></CheckoutSteps>
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        {/* Address */}
        <Form.Group
          controlId='address'
          className='mb-3'
        >
          <Form.Label>Address</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Address'
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>
        {/* city */}
        <Form.Group
          controlId='city'
          className='mb-3'
        >
          <Form.Label>City</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter City'
            value={city}
            required
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>
        {/* postal code */}
        <Form.Group
          controlId='postalCode'
          className='mb-3'
        >
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Postal Code'
            value={postalCode}
            required
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>
        {/* country */}
        <Form.Group
          controlId='country'
          className='mb-3'
        >
          <Form.Label>Country</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Country'
            value={country}
            required
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
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

export default ShippingScreen
