const baseUrl =
  process.env.NODE_ENV === 'development'
    ? 'https://techn-application-backend.herokuapp.com'
    : 'http://localhost:8080'

export default baseUrl
