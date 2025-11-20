import { useState } from 'react';
import { Card, Button, Badge, Stack, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  Heart,
  HeartFill,
  ChatDots,        // ← Use ChatDots instead of MessageCircle
  Clock,
  PencilSquare,
  Trash3
} from 'react-bootstrap-icons';import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useSocket } from '../contexts/SocketContext.jsx';
import { toast } from 'react-hot-toast';

const PostCard = ({ post, onDelete, onLikeUpdate }) => {
  const { user } = useAuth();
  const socket = useSocket();
  const [localPost, setLocalPost] = useState(post);
  const [isLiking, setIsLiking] = useState(false);

  const isOwner = user && user.id === localPost.userId?._id;
  const hasLiked = user && localPost.likes?.includes(user.id);

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like posts');
      return;
    }

    setIsLiking(true);
    try {
      const res = await axios.post(`/api/posts/${localPost._id}/like`);
      setLocalPost(res.data);

      // Trigger real-time update for post owner
      if (!hasLiked) {
        socket.emit('newLike', {
          postId: localPost._id,
          liker: user.username,
          ownerId: localPost.userId._id
        });
        toast.success('Post liked!');
      } else {
        toast('Like removed', { icon: 'Thumbs Down' });
      }

      onLikeUpdate?.(res.data);
    } catch (err) {
      toast.error('Failed to like post');
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Delete this post forever?')) {
      onDelete(localPost._id);
    }
  };

  return (
    <Card className="mb-4 shadow-sm hover-shadow transition-all" style={{ borderRadius: '12px' }}>
      {localPost.image && (
        <Card.Img
          variant="top"
          src={localPost.image}
          alt="Post"
          style={{ height: '300px', objectFit: 'cover', borderRadius: '12px 12px 0 0' }}
        />
      )}

      <Card.Body className="p-4">
        {/* Author + Time */}
        <div className="d-flex align-items-center mb-3">
          <div
            className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
            style={{ width: '40px', height: '40px', fontWeight: 'bold' }}
          >
            {localPost.userId?.username?.[0]?.toUpperCase() || 'A'}
          </div>
          <div>
            <strong>{localPost.userId?.username || 'Unknown User'}</strong>
            <div className="text-muted small">
              <Clock className="me-1" size={12} />
              {formatDistanceToNow(new Date(localPost.createdAt), { addSuffix: true }).replace('about ', '')}            </div>
          </div>
        </div>

        {/* Title & Content */}
        <Card.Title className="mb-3">{localPost.title}</Card.Title>
        <Card.Text className="text-muted">
          {localPost.content.substring(0, 150)}
          {localPost.content.length > 150 && '...'}
        </Card.Text>

        {/* Actions */}
        <Stack direction="horizontal" gap={3} className="mt-4">
          {/* Like Button */}
          <Button
            variant={hasLiked ? 'danger' : 'outline-danger'}
            size="sm"
            onClick={handleLike}
            disabled={isLiking}
            className="d-flex align-items-center gap-2"
          >
            {hasLiked ? <HeartFill size={18} /> : <Heart size={18} />}
            <span>{localPost.likes?.length || 0}</span>
            {isLiking && <span className="ms-2">...</span>}
          </Button>

          {/* Comment Button */}
          <Button variant="outline-primary" size="sm" className="d-flex align-items-center gap-2" as={Link} to={`/posts/${localPost._id}`}>
            <ChatDots size={18} />
            <span>{localPost.comments?.length || 0}</span>
          </Button>

          {/* Owner Actions */}
          {isOwner && (
            <>
              <Dropdown className="ms-auto">
                <Dropdown.Toggle variant="light" size="sm" id="dropdown-basic">
                  Actions
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to={`/edit/${localPost._id}`}>
                    <PencilSquare className="me-2" /> Edit Post
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleDelete} className="text-danger">
                    <Trash3 className="me-2" /> Delete Post
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          )}
        </Stack>
      </Card.Body>

      {/* Footer */}
      <Card.Footer className="text-muted small py-2">
        <Link to={`/posts/${localPost._id}`} className="text-decoration-none">
          Read full post →
        </Link>
      </Card.Footer>
    </Card>
  );
};

export default PostCard;