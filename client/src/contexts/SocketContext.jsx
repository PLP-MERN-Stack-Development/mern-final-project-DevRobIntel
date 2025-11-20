// src/context/SocketContext.jsx
import { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext.jsx';
import { toast } from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const socketRef = useRef(null); // ← This prevents disconnect on re-render

  useEffect(() => {
    // Create socket only once
    if (!socketRef.current) {
      socketRef.current = io(); // Thanks to Vite proxy → no URL needed
      console.log('Socket.IO connected');
    }

    const socket = socketRef.current;

    if (user) {
      socket.emit('joinUserRoom', user.id);

      // Real-time events
      socket.on('newLike', (data) => {
        toast.success(
          data?.liker ? `${data.liker} liked your post!` : 'Someone liked your post!'
        );
      });

      socket.on('newComment', (data) => {
        toast.success(
          data?.commenter ? `${data.commenter} commented on your post!` : 'New comment!'
        );
      });

      socket.on('newPost', () => {
        toast('New post in your feed!', { icon: 'New' });
      });
    }

    // Only disconnect when app unmounts (not on user change)
    return () => {
      // Don't disconnect here — keep connection alive!
      // Only disconnect on page unload
      window.addEventListener('beforeunload', () => {
        socket.disconnect();
      });
    };
  }, [user]); // ← Only re-run when user changes (not socket!)

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;