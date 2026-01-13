import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

export default function AppNavbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold text-white"
        >
          GigFlow
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user && (
              <>
                <Nav.Link as={Link} to="/" className="text-white">
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/post-gig" className="text-white">
                  Post Gig
                </Nav.Link>
                {/*Added My Gigs link */}
                <Nav.Link as={Link} to="/my-gigs" className="text-white">
                  My Gigs
                </Nav.Link>
              </>
            )}
          </Nav>

          <Nav>
            {user ? (
              <>
                <Navbar.Text className="me-3 text-white">
                  Signed in as <strong>{user.name}</strong>
                </Navbar.Text>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="text-white">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="text-white">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
