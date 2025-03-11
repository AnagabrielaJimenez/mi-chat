import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function RegisterPage() {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleRegister() {
    try {
      await register(email, password);
      navigate('/chat'); // Redirige al chat después del registro
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl mb-4">Registro</h2>
      <input type="email" placeholder="Correo" className="p-2 border rounded mb-2" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Contraseña" className="p-2 border rounded mb-2" onChange={(e) => setPassword(e.target.value)} />
      <button className="p-2 bg-green-500 text-white rounded" onClick={handleRegister}>Registrarse</button>
    </div>
  );
}