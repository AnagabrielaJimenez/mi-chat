import { create } from 'zustand';
import useAuthStore from './authStore';
import api from '../services/api';

const useContactsStore = create((set) => ({
  contacts: [],

  fetchContacts: async () => {
    try {
      const { user } = useAuthStore.getState();
      if (!user) throw new Error("Usuario no autenticado");

      const token = localStorage.getItem("token"); // ✅ Obtener el token almacenado
      console.log("🔹 Token enviado en fetchContacts:", token); // 🔍 Verificar el token en consola

      const { data } = await api.get(`/contacts?userId=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({ contacts: data });
    } catch (error) {
      console.error("Error obteniendo contactos:", error.response?.data || error.message);
    }
  },
}));

export default useContactsStore;
