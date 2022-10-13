import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import {
  logoutUser,
  selectUserAuth,
  selectUserAuthStatus,
  selectUserAuthError,
} from '../redux/userAuthSlice'
import { resetUsers } from '../redux/usersSlice'
// we use a link container here since we need to wrap bootstrap components
// use Link from react-router-dom for replacing a tags
const Header = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectUserAuth)
  const { userInfo } = user

  const logoutHandler = () => {
    dispatch(logoutUser())
    dispatch(resetUsers())
  }
  return (
    <header>
      <Navbar
        bg='dark'
        expand='lg'
        variant='dark'
        collapseOnSelect
      >
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>Techn</Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls='navbarScroll' />
          <Navbar.Collapse id='navbarScroll'>
            <Nav
              className='ms-auto'
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <LinkContainer to='/cart'>
                <Nav.Link>
                  <i className='fas fa-shopping-cart me-2'></i>
                  Cart
                </Nav.Link>
              </LinkContainer>

              {userInfo ? (
                <NavDropdown
                  title={userInfo.username}
                  id='username'
                >
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link>
                    <i className='fas fa-user me-2'></i>
                    Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
              {userInfo && userInfo.role === 'ROLE_ADMIN' && (
                <NavDropdown
                  title='Admin'
                  id='adminmenu'
                >
                  <LinkContainer to='/admin/users'>
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/products'>
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/orders'>
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
