// src/pages/Login.jsx
import { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email.toLowerCase().trim(), password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Card style={{ width: '28rem' }} className="shadow-lg">
        <Card.Body className="p-5">
          <h2 className="text-center mb-4 fw-bold text-primary">
            Welcome Back
          </h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </Form.Group>

            <Button type="submit" className="w-100 btn-lg" disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </Form>

          <div className="text-center mt-4">
            <span className="text-muted">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary fw-bold">
                Register here
              </Link>
            </span>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}