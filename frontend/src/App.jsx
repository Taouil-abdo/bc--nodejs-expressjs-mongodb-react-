import { Routes, Route } from 'react-router-dom';
import Register from './pages/Auth/register';
import Login from './pages/Auth/login';

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Register />} />
    </Routes>
  )
}

export default App
