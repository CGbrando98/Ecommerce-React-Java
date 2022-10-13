import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { selectUserAuth } from '../redux/userAuthSlice'
import {
  resetProduct,
  fetchProduct,
  updateProduct,
  selectProduct,
  selectProductStatus,
  selectProductError,
} from '../redux/productSlice'

const ProductEditScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const params = useParams()

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [stock, setStock] = useState(0)
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)

  const productId = params.id

  const { access_token: token } = useSelector(selectUserAuth)

  const product = useSelector(selectProduct)
  const productStatus = useSelector(selectProductStatus)
  const productError = useSelector(selectProductError)

  useEffect(() => {
    if (!product.id_product || product.id_product != productId) {
      dispatch(fetchProduct(productId))
    } else {
      setName(product.name)
      setPrice(product.price)
      setImage(product.image)
      setBrand(product.brand)
      setCategory(product.category)
      setStock(product.stock)
      setDescription(product.description)
    }
    if (productStatus === 'product updated') {
      navigate('/admin/products')
      dispatch(resetProduct())
    }
  }, [product, dispatch])

  const submitHandler = (e) => {
    // dispatch(updateProduct({ token, userId, username, email, isAdmin }))
  }

  return (
    <>
      <Link
        to='/admin/products'
        className='btn btn-light my-3'
      >
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {productStatus === 'loading' ? (
          <Loader></Loader>
        ) : productError ? (
          <Message variant='danger'>productError</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            {/* name input */}
            <Form.Group
              controlId='name'
              className='mb-3'
            >
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            {/* price input */}
            <Form.Group
              controlId='price'
              className='mb-3'
            >
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter Price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>
            {/* image input */}
            <Form.Group
              controlId='image'
              className='mb-3'
            >
              <Form.Label>Image</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Image URL'
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
            </Form.Group>
            {/* Brand input */}
            <Form.Group
              controlId='brand'
              className='mb-3'
            >
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Brand'
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>
            {/* category input */}
            <Form.Group
              controlId='category'
              className='mb-3'
            >
              <Form.Label>Category</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter category'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>
            {/* stock input */}
            <Form.Group
              controlId='countInStock'
              className='mb-3'
            >
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter product stock'
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              ></Form.Control>
            </Form.Group>
            {/* stock description */}
            <Form.Group
              controlId='description'
              className='mb-3'
            >
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
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

export default ProductEditScreen
