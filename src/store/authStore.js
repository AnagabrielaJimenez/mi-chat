import { create } from 'zustand';
import supabase from '../services/supabase';
import api from '../services/api'; // ✅ Se mantiene el uso de api.js para llamadas al backend

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null, // ✅ Cargar token de localStorage

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.session?.access_token); // ✅ Guardar token correctamente
    set({ user: data.user, token: data.session?.access_token });
  },

  register: async (email, password, navigate) => { // 🔹 Agregamos navigate
    const { data, error } = await supabase.auth.signUp({ email, password });
  
    if (error) {
      console.error('Error al registrar en auth.users:', error);
      throw error;
    }
  
    const user = data.user;
    const token = data.session?.access_token;
  
    if (user) {
      try {
        await api.post('/users', {
          id: user.id,
          email: user.email,
          full_name: '',
          avatar_url: ''
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        console.log('✅ Usuario guardado en users con nombre vacío');
      } catch (userError) {
        console.error('Error al crear usuario en users:', userError);
      }
    }
  
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    set({ user, token });
  
    // 🔹 Redirigir a ProfilePage.jsx para que complete su perfil
    navigate('/profile');
  },  

  logout: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // ✅ Borrar token al cerrar sesión
    set({ user: null, token: null });
  },

  checkSession: async () => {
    const { data, error } = await supabase.auth.getSession(); // ✅ Obtiene sesión con token
    if (error) return console.error('Error obteniendo sesión:', error.message);

    if (data.session) {
      localStorage.setItem('user', JSON.stringify(data.session.user));
      localStorage.setItem('token', data.session.access_token); // ✅ Guardar token en localStorage
      set({ user: data.session.user, token: data.session.access_token });
    }
  },
}));

export default useAuthStore;
