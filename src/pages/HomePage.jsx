import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl mb-4">Bienvenido a Mi Chat</h1>
      <Link to="/login" className="p-2 bg-blue-500 text-white rounded mb-2">Iniciar Sesión</Link>
      <Link to="/register" className="p-2 bg-green-500 text-white rounded">Registrarse</Link>
    </div>
  );
}