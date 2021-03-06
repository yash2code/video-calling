import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Nav, Navbar, NavItem } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import './App.css'
import Routes from './Routes'
import { AppContext } from './libs/contextLib'
import { Auth } from 'aws-amplify'
import { onError } from './libs/errorLib'

function App() {
  const history = useHistory()
  const [isAuthenticating, setIsAuthenticating] = useState(true)
  const [isAuthenticated, userHasAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState(null)

  useEffect(() => {
    onLoad()
  }, [])

  async function onLoad() {
    try {
      const user = await Auth.currentSession()
      console.log(user.getIdToken().payload.email)
      setUserEmail(user.getIdToken().payload.email)

      userHasAuthenticated(true)
    } catch (e) {
      if (e !== 'No current user') {
        onError(e)
      }
    }

    setIsAuthenticating(false)
  }

  async function handleLogout() {
    await Auth.signOut()

    userHasAuthenticated(false)
    history.push('/login')
  }

  return (
    !isAuthenticating && (
      <div className='App container'>
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to='/'>WeAdmit</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {isAuthenticated ? (
                <NavItem onClick={handleLogout}>Logout</NavItem>
              ) : (
                <>
                  <LinkContainer to='/signup'>
                    <NavItem>Signup</NavItem>
                  </LinkContainer>
                  <LinkContainer to='/login'>
                    <NavItem>Login</NavItem>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <AppContext.Provider
          value={{ isAuthenticated, userHasAuthenticated, userEmail, setUserEmail }}
        >
          <Routes />
        </AppContext.Provider>
      </div>
    )
  )
}

export default App
