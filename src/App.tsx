import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Stats from './pages/Stats';
import ForgotPassword from './pages/ForgotPassword';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('jwt');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/change-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/statistics" element={<PrivateRoute><Stats /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}