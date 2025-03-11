import { create } from 'zustand';
import supabase from '../services/supabase';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) throw error;
    localStorage.setItem('user', JSON.stringify(data.user)); // ✅ Guardar sesión en localStorage
    set({ user: data.user });
  },

  logout: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('user'); // ✅ Eliminar sesión de localStorage
    set({ user: null });
  },

  checkSession: async () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      set({ user: storedUser });
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        localStorage.setItem('user', JSON.stringify(user)); // ✅ Guardar usuario si está autenticado
        set({ user });
      }
    }
  },
}));

export default useAuthStore;
