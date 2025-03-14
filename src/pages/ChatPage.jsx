import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useMessagesStore from '../store/messagesStore';
import useContactsStore from '../store/contactsStore';
import useAuthStore from '../store/authStore';
import supabase from '../services/supabase';
import AddContactModal from './AddContactModal'; // ✅ IMPORTAR EL MODAL

export default function ChatPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { contacts, fetchContacts, searchNewContacts, addContact } = useContactsStore();
  const { messages, fetchMessages } = useMessagesStore();

  const [newMessage, setNewMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showAddContact, setShowAddContact] = useState(false); // ✅ Estado para el modal

  useEffect(() => {
    if (user) fetchContacts();
  }, [user]);

  useEffect(() => {
    if (user && selectedContact) fetchMessages(user.id, selectedContact.id);
  }, [selectedContact]);

  useEffect(() => {
    const subscription = supabase
      .channel('realtime-messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        useMessagesStore.setState((state) => {
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
    if (!newMessage.trim() || !selectedContact) return;
    const senderId = user?.id;
    const receiverId = selectedContact?.id;

    if (!senderId || !receiverId) {
      console.error('❌ Error: senderId o receiverId son inválidos', { senderId, receiverId });
      return;
    }

    console.log('📩 Enviando mensaje:', { senderId, receiverId, content: newMessage });
    await useMessagesStore.getState().sendMessage(senderId, receiverId, newMessage);
    setNewMessage('');
  }

  async function handleSearchContacts() {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const results = await searchNewContacts(searchQuery);
    setSearchResults(results);
  }

  async function handleAddContact(contactId) {
    await addContact(contactId);
    setSearchQuery('');
    setSearchResults([]);
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

        {/* 🔎 Barra de búsqueda */}
        <input
          type="text"
          placeholder="Buscar contactos..."
          className="w-full p-2 mb-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && handleSearchContacts()} // 🔹 Buscar al presionar Enter
        />
        <button className="w-full p-2 bg-blue-500 rounded mb-2" onClick={handleSearchContacts}>
          Buscar
        </button>

        {/* ➕ BOTÓN PARA ABRIR EL MODAL DE NUEVOS CONTACTOS */}
        <button className="w-full p-2 bg-green-500 hover:bg-green-600 text-white rounded mb-2" onClick={() => setShowAddContact(true)}>
          ➕ Agregar Contacto
        </button>

        {/* 🔎 Mostrar resultados de búsqueda o contactos */}
        <ul className="space-y-2">
          {searchQuery ? (
            searchResults.length > 0 ? (
              searchResults.map((result) => (
                <li key={result.id} className="p-2 flex justify-between items-center bg-gray-700 rounded">
                  {result.full_name}
                  <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={() => handleAddContact(result.id)}>
                    ➕
                  </button>
                </li>
              ))
            ) : (
              <p className="text-center text-gray-400">No se encontraron contactos</p>
            )
          ) : (
            contacts.map((contact) => (
              <li
                key={contact.id}
                className={`p-2 cursor-pointer rounded transition-all ${
                  selectedContact?.id === contact.contactUser?.id ? 'bg-blue-500' : 'hover:bg-gray-700'
                }`}
                onClick={() => setSelectedContact(contact.contactUser)}
              >
                {contact.contactUser.full_name}
              </li>
            ))
          )}
        </ul>
      </div>

      {/* 📌 Chat principal */}
      <div className="w-3/4 flex flex-col p-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">{selectedContact ? selectedContact.full_name : 'Selecciona un contacto'}</h2>
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

        {/* 🔹 Input de mensajes con "Enter" para enviar */}
        <div className="mt-4 flex">
          <input
            type="text"
            className="flex-1 p-2 border border-gray-600 bg-gray-700 rounded text-white"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} // 🔹 Enviar con "Enter"
          />
          <button className="ml-2 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded" onClick={handleSendMessage}>
            Enviar
          </button>
        </div>
      </div>

      {/* 🔹 MODAL PARA AGREGAR CONTACTOS */}
      {showAddContact && <AddContactModal onClose={() => setShowAddContact(false)} />}
    </div>
  );
}