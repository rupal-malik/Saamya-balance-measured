import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
 
// base "./" makes CSS, JS and image URLs relative, so the build works at a
// domain root (Vercel/Netlify) and under a sub-path (GitHub Pages: user.github.io/repo/).
export default defineConfig({
  plugins: [react()],
  base: "./",
});
 
