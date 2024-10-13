import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/PlacePicker/", // Add your repository name here (case-sensitive)
  plugins: [react()],
});
