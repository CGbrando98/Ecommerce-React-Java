import { resetOrder } from './redux/orderSlice'
import { resetOrdersPlaced } from './redux/ordersPlacedSlice'
import { resetReview } from './redux/reviewSlice'
import { newAccessToken, logoutUser } from './redux/userAuthSlice'
import { resetUsers } from './redux/usersSlice'
import { fetchUserReset } from './redux/userSlice'
import { resetOrderPlaced } from './redux/orderPlacedSlice'
const tokenCheck = (dispatch, userId, CRUDError, userError, refreshToken) => {
  if (
    userId &&
    CRUDError?.substring(0, 29) === 'Access: The Token has expired' &&
    !(userError?.substring(0, 30) === 'Refresh: The Token has expired')
  ) {
    dispatch(newAccessToken(refreshToken))
  }
  // refresh token expires
  if (userError?.substring(0, 30) === 'Refresh: The Token has expired') {
    dispatch(logoutUser())
    dispatch(resetOrdersPlaced())
    dispatch(resetOrderPlaced())
    // dispatch(resetOrder())
    dispatch(resetUsers())
    dispatch(fetchUserReset())
    dispatch(resetReview())
  }
}

export default tokenCheck
