import { useEffect } from 'react';
import useAuthStore from './store/authStore';
import AppRouter from './router';

function App() {
  const checkSession = useAuthStore((state) => state.checkSession);

  useEffect(() => {
    checkSession(); // ✅ Verificar sesión al cargar la app
  }, []);

  return <AppRouter />;
}

export default App;