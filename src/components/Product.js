import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import Rating from './Rating'

const Product = ({ product }) => {
  return (
    <Card className='my-3 p-3 rounded'>
      <Link to={`/products/${product.id_product}`}>
        <Card.Img
          src={product.image}
          variant='top'
        ></Card.Img>
      </Link>
      <Card.Body>
        <Link to={`/products/${product.id_product}`}>
          <Card.Title as='div'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div'>
          <Rating
            value={product.avgrating}
            text={`${product.reviews} reviews`}
          ></Rating>
        </Card.Text>

        <Card.Text as='div'>${product.price}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Product
