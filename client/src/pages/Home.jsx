// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import PostCard from '../components/PostCard.jsx';
import axios from 'axios';
import { Container, Row, Col, Spinner, Alert, Button, Pagination } from 'react-bootstrap';
import { PlusCircle } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = async (page = 1) => {
    if (page < 1) page = 1;
    setLoading(true);
    try {
      const res = await axios.get(`/api/posts?page=${page}&limit=6`);
      setPosts(res.data.posts);
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
      setError('');
    } catch (err) {
      setError('Failed to load posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const handleDelete = (postId) => {
    setPosts(posts.filter(p => p._id !== postId));
  };

  const handleLikeUpdate = (updatedPost) => {
    setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p));
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading posts...</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold text-primary">254 Edition!</h1>
        {user && (
          <Button as={Link} to="/create" variant="success">
            <PlusCircle className="me-2" /> Create Post
          </Button>
        )}
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {posts.length === 0 ? (
        <Alert variant="info" className="text-center">
          <h4>No posts yet!</h4>
          <p>Be the first to share something!</p>
          {user && <Button as={Link} to="/create">Create First Post</Button>}
        </Alert>
      ) : (
        <>
          <Row>
            {posts.map(post => (
              <Col xs={12} md={6} lg={4} key={post._id} className="mb-4">
                <PostCard post={post} onDelete={handleDelete} onLikeUpdate={handleLikeUpdate} />
              </Col>
            ))}
          </Row>

          {totalPages > 1 && (
            <Pagination className="justify-content-center mt-4">
              <Pagination.Prev 
                onClick={() => fetchPosts(currentPage - 1)} 
                disabled={currentPage <= 1}/>
              <Pagination.Item active>{currentPage}</Pagination.Item>
              <Pagination.Next 
                onClick={() => fetchPosts(currentPage + 1)} 
                disabled={currentPage >= totalPages}/>  
          </Pagination>
          )}
        </>
      )}
    </Container>
  );
};

export default Home;