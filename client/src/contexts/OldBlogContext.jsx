import { createContext, useState, useEffect, useCallback, useRef } from 'react';
import useApi from '../hooks/useApi.js';

export const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const api = useApi();
  const isInitialLoad = useRef(true);

  const fetchPosts = useCallback(async (page = 1) => {
    console.log(`Fetching page ${page}...`);
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.getAllPosts({ page, limit: 9 });
      const data = response.data || {};
      
      setPosts(data.posts || []);
      setCurrentPage(data.page || 1);
      setTotalPages(data.totalPages || 1);
      
      console.log(`Page ${page} loaded: ${(data.posts || []).length} posts`);
    } catch (err) {
      setError(err.message || 'Failed to fetch posts');
      console.error('Fetch error:', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [api]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.getAllCategories();
      setCategories(response.data || []);
    } catch (err) {
      console.error('Categories error:', err);
      setCategories([]);
    }
  }, [api]);

  // LOAD ONCE
  useEffect(() => {
    if (isInitialLoad.current) {
      console.log('🚀 Initial load...');
      isInitialLoad.current = false;
      fetchPosts(1);
      fetchCategories();
    }
  }, []);

  const addPost = useCallback(async (postData) => {
    try {
      const response = await api.createPost(postData);
      setPosts(prev => [response.data, ...prev]);
      setCurrentPage(1);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to create post');
      throw err;
    }
  }, [api]);

  const updatePost = useCallback(async (postId, postData) => {
    try {
      const response = await api.updatePost(postId, postData);
      setPosts(prev => prev.map(post => post._id === postId ? response.data : post));
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to update post');
      throw err;
    }
  }, [api]);

  const deletePost = useCallback(async (postId) => {
    try {
      await api.deletePost(postId);
      setPosts(prev => prev.filter(post => post._id !== postId));
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to delete post');
      throw err;
    }
  }, [api]);

  const fetchPostById = useCallback(async (postId) => {
    try {
      const response = await api.getPostById(postId);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch post');
      throw err;
    }
  }, [api]);

  // PLAIN OBJECT - NO useMemo!
  const value = {
    posts,
    categories,
    loading,
    error,
    currentPage,
    totalPages,
    fetchPosts,
    addPost,
    updatePost,
    deletePost,
    fetchPostById,
    setError,
  };

  return (
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  );
};

export default BlogProvider;