// src/components/Post.jsx
import { useState } from 'react';
import { Form, Button, Spinner, Card } from 'react-bootstrap';

const Post = ({ onSubmit, defaultValues, categories, loading }) => {
  const [formData, setFormData] = useState({
    title: defaultValues.title || '',
    content: defaultValues.content || '',
    category: defaultValues.category || '',
    image: null
  });

  const [preview, setPreview] = useState(defaultValues.image || null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="p-4 shadow">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            disabled={loading}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
            disabled={loading}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            disabled={loading}
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Image (optional)</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={handleImage} disabled={loading} />
          {preview && (
            <div className="mt-3">
              <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }} />
            </div>
          )}
        </Form.Group>

        <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-100">
          {loading ? (
            <>
              <Spinner animation="border" size="sm" /> Saving...
            </>
          ) : (
            'Save Post'
          )}
        </Button>
      </Form>
    </Card>
  );
};

export default Post;