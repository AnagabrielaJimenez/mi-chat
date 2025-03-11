import { create } from 'zustand';
import api from '../services/api';

const useMessagesStore = create((set) => ({
  messages: [],

  fetchMessages: async (limit = 20, offset = 0) => {
    try {
      const { data } = await api.get(`/messages?limit=${limit}&offset=${offset}`);
      set({ messages: data });
    } catch (error) {
      console.error('Error al obtener mensajes:', error.response?.data || error.message);
    }
  },

  sendMessage: async (senderId, content) => {
    try {
      const { data } = await api.post('/messages', { senderId, content });
  
      if (data) {
        const newMessage = Array.isArray(data) ? data[0] : data;
        set((state) => ({ messages: [...state.messages, newMessage] }));
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error.response?.data || error.message);
    }
  },  
}));

export default useMessagesStore;