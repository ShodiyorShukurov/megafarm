import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';



// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@ckeditor/ckeditor5-build-classic/build/ckeditor.css";`
      },
    },
  },
});
