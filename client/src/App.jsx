// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { SocketProvider } from './contexts/SocketContext.jsx';
import { Toaster } from 'react-hot-toast';

import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import PostEdit from './pages/PostEdit.jsx';
import Post from './pages/Post.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<PostEdit />} />
              <Route path="/edit/:id" element={<PostEdit />} />
              <Route path="/posts/:id" element={<Post />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Layout>
          <Toaster position="top-right" />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;