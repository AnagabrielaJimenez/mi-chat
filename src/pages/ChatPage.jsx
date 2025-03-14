import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useMessagesStore from '../store/messagesStore';
import useContactsStore from '../store/contactsStore';
import useAuthStore from '../store/authStore';
import supabase from '../services/supabase';

export default function ChatPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { contacts, fetchContacts } = useContactsStore();
  const { messages, fetchMessages } = useMessagesStore();
  const [newMessage, setNewMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    if (user) fetchContacts(user.id);
  }, [user]);

  useEffect(() => {
    if (user && selectedContact) fetchMessages(user.id, selectedContact.id);
  }, [selectedContact]);

  useEffect(() => {
    const subscription = supabase
      .channel('realtime-messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        useMessagesStore.setState((state) => {
          // 🔹 Evitar insertar duplicados en tiempo real
          if (!state.messages.some(msg => msg.id === payload.new.id)) {
            return { messages: [...state.messages, payload.new] };
          }
          return state;
        });
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleSendMessage() {
    if (!newMessage.trim() || !selectedContact) return; // ✅ Asegurarse de que hay un destinatario
  
    const senderId = useAuthStore.getState().user?.id;
    const receiverId = selectedContact?.id; // ✅ El receptor es el contacto seleccionado
  
    if (!senderId || !receiverId) {
      console.error('❌ Error: senderId o receiverId son inválidos', { senderId, receiverId });
      return;
    }
  
    console.log('📩 Enviando mensaje:', { senderId, receiverId, content: newMessage });
  
    await useMessagesStore.getState().sendMessage(senderId, receiverId, newMessage);
    setNewMessage('');
  }

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* 📌 Panel de contactos */}
      <div className="w-1/4 bg-gray-800 p-4 border-r border-gray-700">
        <h2 className="text-lg font-bold mb-2 text-center">Contactos</h2>
        <ul className="space-y-2">
          {contacts.map((contact) => (
            <li
              key={contact.id}
              className={`p-2 cursor-pointer rounded transition-all ${
                selectedContact?.id === contact.id ? 'bg-blue-500' : 'hover:bg-gray-700'
              }`}
              onClick={() => setSelectedContact(contact.contactUser)}
            >
              {contact.contactUser.full_name}
            </li>
          ))}
        </ul>
      </div>

      {/* 📌 Chat principal */}
      <div className="w-3/4 flex flex-col p-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">
            {selectedContact ? selectedContact.full_name : 'Selecciona un contacto'}
          </h2>
          <button className="p-2 bg-red-500 hover:bg-red-600 rounded" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-800 p-4 rounded shadow-md border border-gray-700">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-2 my-2 rounded-lg max-w-xs ${
                msg.sender_id === user.id ? 'bg-blue-500 text-white self-end ml-auto' : 'bg-gray-600'
              }`}
            >
              {msg.content}
            </div>
          ))}
        </div>

        <div className="mt-4 flex">
          <input
            type="text"
            className="flex-1 p-2 border border-gray-600 bg-gray-700 rounded text-white"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button className="ml-2 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded" onClick={handleSendMessage}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}