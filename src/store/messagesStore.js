import { create } from 'zustand';
import api from '../services/api';
import useAuthStore from './authStore'; // ✅ Importar el authStore para obtener el userId

const useMessagesStore = create((set) => ({
  messages: [],

  fetchMessages: async (contactId) => {
    try {
      const userId = useAuthStore.getState().user?.id; // ✅ Obtener el ID del usuario autenticado
      if (!userId) throw new Error('Usuario no autenticado');

      const { data } = await api.get(`/messages?userId=${userId}&contactId=${contactId}`);
      set({ messages: data });
    } catch (error) {
      console.error('Error obteniendo mensajes:', error.message);
    }
  },

  sendMessage: async (senderId, receiverId, content) => {
    try {
      if (!senderId || !receiverId) throw new Error('❌ senderId o receiverId es inválido');
  
      const { data } = await api.post('/messages', { senderId, receiverId, content });
  
      if (data && data.length > 0) {
        console.log('✅ Mensaje enviado correctamente:', data[0]);
      }
    } catch (error) {
      console.error('❌ Error al enviar mensaje:', error.message);
    }
  },

}));

export default useMessagesStore;
