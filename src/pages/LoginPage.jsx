import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    try {
      await login(email, password);
      navigate('/chat'); // Redirige al chat si el login es exitoso
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl mb-4">Iniciar Sesión</h2>
      <input type="email" placeholder="Correo" className="p-2 border rounded mb-2" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Contraseña" className="p-2 border rounded mb-2" onChange={(e) => setPassword(e.target.value)} />
      <button className="p-2 bg-blue-500 text-white rounded" onClick={handleLogin}>Ingresar</button>
    </div>
  );
}