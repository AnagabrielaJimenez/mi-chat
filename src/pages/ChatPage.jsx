import { useEffect } from 'react';
import useMessagesStore from '../store/messagesStore';
import api from '../services/api';

export default function ChatPage() {
  const { messages, fetchMessages } = useMessagesStore();

  useEffect(() => {
    fetchMessages(); // ✅ Cargar mensajes al inicio

    // ✅ Suscribirse a nuevos mensajes en tiempo real
    const eventSource = new EventSource('http://localhost:3000/messages/stream');

    eventSource.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      useMessagesStore.setState((state) => ({ messages: [...state.messages, newMessage] }));
    };

    return () => {
      eventSource.close(); // ✅ Cerrar la conexión al salir
    };
  }, []);

  return (
    <div className="chat-container">
      {messages.map((msg) => (
        <div key={msg.id} className="message">
          {msg.content}
        </div>
      ))}
    </div>
  );
}
