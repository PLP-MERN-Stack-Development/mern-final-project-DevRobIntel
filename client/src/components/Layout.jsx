import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { House, PencilSquare, BoxArrowRight, PersonCircle } from 'react-bootstrap-icons';
import { useAuth } from '../contexts/AuthContext.jsx';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand as={Link} to="/">ConnectSphere</Navbar.Brand>

          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              <House className="me-1" /> Home
            </Nav.Link>
            {user && (
              <Nav.Link as={Link} to="/create">
                <PencilSquare className="me-1" /> Create Post
              </Nav.Link>
            )}
          </Nav>

          {/* Right Side: Auth Status */}
          <Nav className="ms-auto align-items-center">
            {user ? (
              <>
                <Navbar.Text className="text-white me-3">
                  <PersonCircle className="me-1" />
                  Hi, <strong>{user.username}</strong>
                </Navbar.Text>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={logout}
                  className="d-flex align-items-center gap-1"
                >
                  <BoxArrowRight />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="text-white">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  <Button variant="outline-light" size="sm">
                    Register
                  </Button>
                </Nav.Link>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container className="mt-4">{children}</Container>
    </>
  );
};

export default Layout;