import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Spinner, Alert, Button } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import PostForm from '../components/PostForm.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { toast } from 'react-hot-toast';

const PostEdit = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [defaultValues, setDefaultValues] = useState({
    title: '',
    content: '',
    category: '',
    image: null
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch categories + post (if editing)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch categories
        const catRes = await axios.get('/api/categories');
        setCategories(catRes.data);

        // If editing → fetch post
        if (isEditMode && id) {
          const postRes = await axios.get(`/api/posts/${id}`);
          const post = postRes.data;

          setDefaultValues({
            title: post.title || '',
            content: post.content || '',
            category: post.category?._id || '',
            image: post.image || null
          });
        }
      } catch (err) {
        setError('Failed to load data');
        toast.error('Failed to load post or categories');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');

      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      data.append('category', formData.category);
      if (formData.image) data.append('image', formData.image);

      if (isEditMode) {
        await axios.put(`/api/posts/${id}`, data);
        toast.success('Post updated!');
      } else {
        await axios.post('/api/posts', data);
        toast.success('Post created!');
      }

      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.msg || 'Failed to save post';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
        <p className="mt-3">Loading {isEditMode ? 'post...' : 'form...'}</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <div className="d-flex align-items-center mb-4">
        <Button variant="outline-secondary" onClick={() => navigate(-1)} className="me-3">
          <ArrowLeft /> Back
        </Button>
        <h1 className="mb-0">{isEditMode ? 'Edit Post' : 'Create New Post'}</h1>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <PostForm
        onSubmit={handleSubmit}
        defaultValues={defaultValues}
        categories={categories}
        loading={loading}
        isEditMode={isEditMode}
      />
    </Container>
  );
};

export default PostEdit;