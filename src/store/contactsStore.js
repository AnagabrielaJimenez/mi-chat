import { create } from 'zustand';
import useAuthStore from './authStore';
import api from '../services/api';

const useContactsStore = create((set) => ({
  contacts: [],
  
  // 🔹 Obtener contactos actuales
  fetchContacts: async () => {
    try {
      const { user } = useAuthStore.getState();
      if (!user) throw new Error("Usuario no autenticado");

      const token = localStorage.getItem("token");
      const { data } = await api.get(`/contacts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({ contacts: data });
    } catch (error) {
      console.error("Error obteniendo contactos:", error.response?.data || error.message);
    }
  },

  // 🔹 Buscar nuevos contactos por correo
  searchNewContacts: async (query) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await api.get(`/contacts/search-new?query=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return data;
    } catch (error) {
      console.error("Error buscando contactos:", error.response?.data || error.message);
      return [];
    }
  },

  async searchContacts(query) {
    try {
      const token = localStorage.getItem("token");
      console.log("🔎 Buscando contactos con query:", query);
  
      const { data } = await api.get(`/contacts/search?query=${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      console.log("✅ Contactos encontrados:", data);
      set({ searchResults: data });
    } catch (error) {
      console.error("❌ Error buscando contactos:", error.response?.data || error.message);
    }
  },  

  // 🔹 Agregar un nuevo contacto
  addContact: async (contactId) => {
    try {
      const token = localStorage.getItem("token");
      await api.post(`/contacts`, { contact_id: contactId }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await useContactsStore.getState().fetchContacts(); // ✅ Refrescar la lista de contactos
    } catch (error) {
      console.error("Error agregando contacto:", error.response?.data || error.message);
    }
  }
}));

export default useContactsStore;
