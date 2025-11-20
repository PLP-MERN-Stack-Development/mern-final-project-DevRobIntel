import { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { username, email, password, confirmPassword } = formData;

    // Client-side validation
    if (!username || !email || !password || !confirmPassword) {
      return setError('All fields are required');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      await register(username.trim(), email.toLowerCase().trim(), password);
      navigate('/'); // Redirect to home after successful register
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Card style={{ width: '28rem' }} className="shadow-lg">
        <Card.Body className="p-5">
          <h2 className="text-center mb-4 fw-bold text-primary">
            Create Account
          </h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                required
                minLength="6"
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Type password again"
                required
                disabled={loading}
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100 btn-lg"
              variant="primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Creating Account...
                </>
              ) : (
                'Register'
              )}
            </Button>
          </Form>

          <div className="text-center mt-4">
            <span className="text-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-primary fw-bold">
                Login here
              </Link>
            </span>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}