import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, Container } from 'react-bootstrap'

// we use a link container here since we need to wrap bootstrap components
// use Link from react-router-dom for replacing a tags
const Header = () => {
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

              <LinkContainer to='/login'>
                <Nav.Link>
                  <i className='fas fa-user me-2'></i>
                  Sign In
                </Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
