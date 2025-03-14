import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import api from '../services/api';

export default function ProfilePage() {
  const { user, token } = useAuthStore();
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const { data } = await api.get(`/users/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFullName(data.full_name || '');
        setAvatarUrl(data.avatar_url || 'https://placehold.co/80'); // ✅ Nueva URL de placeholder
      } catch (error) {
        console.error('Error al obtener perfil:', error);
      }
    }

    if (user) fetchUserProfile();
  }, [user, token]);

  async function handleSaveProfile() {
    if (!token) {
      console.error('❌ Error: Token no disponible');
      return;
    }

    try {
      const { data } = await api.put(`/users/${user.id}`, {
        full_name: fullName,
        avatar_url: avatarUrl
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('✅ Perfil actualizado:', data);
      alert('Perfil actualizado correctamente');
    } catch (error) {
      console.error('❌ Error al actualizar perfil:', error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Perfil de Usuario</h2>
        
        {/* 🔹 Mostrar Avatar y Correo */}
        <div className="flex items-center space-x-4 mb-4">
          <img 
            src={avatarUrl || "https://placehold.co/80"}  
            alt="Avatar"
            className="w-16 h-16 rounded-full border-2 border-gray-400"
          />
          <div>
            <p className="text-lg font-semibold">{user.email}</p>
            <p className="text-sm text-gray-400">ID: {user.id}</p>
          </div>
        </div>

        {/* 🔹 Formulario de edición */}
        <div className="flex flex-col space-y-4">
          <input 
            type="text" 
            placeholder="Nombre completo" 
            value={fullName} 
            onChange={(e) => setFullName(e.target.value)} 
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-400"
          />
          <input 
            type="text" 
            placeholder="URL del avatar" 
            value={avatarUrl} 
            onChange={(e) => setAvatarUrl(e.target.value)} 
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-400"
          />
          <button 
            onClick={handleSaveProfile} 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md font-bold"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
