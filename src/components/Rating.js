import React from 'react'

const Rating = ({ value, text, color }) => {
  const stars = [1, 2, 3, 4, 5]
  return (
    <div className='rating'>
      {stars.map((star) => (
        <span key={star}>
          <i
            style={{ color }}
            className={
              value >= star
                ? 'fas fa-star'
                : value >= star - 0.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
            }
          ></i>
        </span>
      ))}
      <span className='mx-2'>{text && text}</span>
    </div>
  )
}

Rating.defaultProps = {
  color: 'Gold',
}

export default Rating
