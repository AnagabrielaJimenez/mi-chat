import { useState } from 'react';
import useContactsStore from '../store/contactsStore';

export default function AddContactModal({ onClose }) {
  const { searchNewContacts, addContact } = useContactsStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  async function handleSearch() {
    const foundUsers = await searchNewContacts(query);
    setResults(foundUsers);
  }

  async function handleAddContact(contactId) {
    await addContact(contactId);
    onClose(); // ✅ Cerrar el modal después de agregar
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-bold text-white">Agregar Nuevo Contacto</h2>

        <input
          type="text"
          placeholder="Buscar por correo..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 mt-2 bg-gray-700 border border-gray-600 rounded-md text-white"
        />
        <button onClick={handleSearch} className="w-full p-2 mt-2 bg-blue-500 rounded">
          Buscar
        </button>

        <ul className="mt-2">
          {results.map((user) => (
            <li key={user.id} className="flex justify-between items-center p-2 bg-gray-700 rounded mt-1">
              <span>{user.email}</span>
              <button onClick={() => handleAddContact(user.id)} className="bg-green-500 p-1 rounded">
                ➕
              </button>
            </li>
          ))}
        </ul>

        <button onClick={onClose} className="w-full mt-3 p-2 bg-red-500 rounded">
          Cerrar
        </button>
      </div>
    </div>
  );
}