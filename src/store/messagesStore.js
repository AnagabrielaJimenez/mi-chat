import { create } from 'zustand';
import api from '../services/api';
import useAuthStore from './authStore'; // ✅ Importar el authStore para obtener el userId

const useMessagesStore = create((set) => ({
  messages: [],

  async fetchMessages(userId, contactId) {
    try {
      const token = useAuthStore.getState().token;
  
      if (!token) {
        console.error('❌ Error: Token no disponible');
        return;
      }
  
      const { data } = await api.get(`/messages?userId=${userId}&contactId=${contactId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      console.log('✅ Mensajes obtenidos:', data);
  
      // 🔹 **Actualiza el estado global de messages**
      set({ messages: data });  
      set((state) => ({
        messages: [...new Map([...state.messages, ...data].map(m => [m.id, m])).values()]
      }));      
    } catch (error) {
      console.error('❌ Error obteniendo mensajes:', error);
    }
  },

  async sendMessage(senderId, receiverId, content) {
    try {
      const { token } = useAuthStore.getState();

      const response = await api.post('/messages', {
        senderId,
        receiverId,
        content,
      }, {
        headers: { Authorization: `Bearer ${token}` } // ✅ Agregar el token aquí
      });
  
      console.log('✅ Mensaje enviado correctamente:', response.data);
    } catch (error) {
      console.error('❌ Error al enviar mensaje:', error);
    }
  }  

}));

export default useMessagesStore;
