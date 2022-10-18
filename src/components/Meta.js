import React from 'react'
import Helmet from 'react-helmet'

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta
        name='decription'
        content={description}
      />
      <meta
        name='keywords'
        content={keywords}
      />
    </Helmet>
  )
}

Meta.defaultProps = {
  title: 'Welcome to Techn',
  description: 'We sell the latest tech gadgets',
  keywords: 'electronics, buy electronics, cheap electronics',
}

export default Meta
