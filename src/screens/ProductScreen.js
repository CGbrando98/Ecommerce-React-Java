import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap'
import Rating from '../components/Rating'
// import axios from 'axios'
// import products from '../products'

const ProductScreen = () => {
  const { id } = useParams()
  // const [product, setProduct] = useState({})
  useEffect(() => {
    // const fetchProduct = async () => {
    //   const req = await axios.get(`http://localhost:8080/api/products/${id}`)
    //   setProduct(req.data)
    // }
    // fetchProduct()
  }, [])

  return (
    <>
      <LinkContainer to='/'>
        <Button
          variant='dark'
          className='my-3'
        >
          Go Back
        </Button>
      </LinkContainer>

      <Row>
        <Col md={6}>
          <Image
            src={product.image}
            alt={product.productname}
            fluid
          ></Image>
        </Col>
        <Col md={3}>
          {/* flush takes away border of the ul*/}
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h3>{product.productname}</h3>
            </ListGroup.Item>

            <ListGroup.Item>
              <Rating
                value={product.avgrating}
                text={`${product.reviews} reviews`}
              />
            </ListGroup.Item>

            <ListGroup.Item>Price: ${product.price}</ListGroup.Item>

            <ListGroup.Item>Description: {product.description}</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <Row>
                  <Col> Price:</Col>
                  <Col>
                    <strong>${product.price}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col> Status:</Col>
                  <Col>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Button
                  className='btn w-100'
                  type='button'
                  disabled={product.stock === 0}
                >
                  Add to Cart
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default ProductScreen
