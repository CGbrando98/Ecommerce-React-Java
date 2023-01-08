//base url
const baseUrl =
  process.env.REACT_APP_ENV === 'production'
    ? process.env.REACT_APP_MY_PROD_URL
    : process.env.REACT_APP_MY_DEV_URL

export default baseUrl
