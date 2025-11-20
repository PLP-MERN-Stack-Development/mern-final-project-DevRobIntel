import { useState, useCallback } from 'react';
import api from '../services/api.js';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllPosts = useCallback(async (params = {}) => {
    const { page = 1, limit = 10 } = params;
    setLoading(true);
    try {
      const response = await api.get('/posts', { params: { page, limit } });
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPostById = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/posts/${id}`);
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/categories');
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = useCallback(async (data) => {
    setLoading(true);
    try {
      const response = await api.post('/posts', data);
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePost = useCallback(async (id, data) => {
    setLoading(true);
    try {
      const response = await api.put(`/posts/${id}`, data);
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePost = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await api.delete(`/posts/${id}`);
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    setError,
    getAllPosts,
    getPostById, // NEW
    getAllCategories,
    createPost,
    updatePost, // NEW
    deletePost,
  };
};

export default useApi;