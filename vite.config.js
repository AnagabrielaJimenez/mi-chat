import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(),
    tailwindcss({
      config: {
        darkMode: "class", // Habilita el modo oscuro con una clase
        theme: {
          extend: {
            colors: {
              primary: "#ff4b82", // Color para botones/enlaces destacados
              secondary: "#1e1e2e", // Fondo oscuro elegante
              chatBubbleIncoming: "#33354a",
              chatBubbleOutgoing: "#7b5eea",
            },
          },
        },
      },
    }),
  ],
});
