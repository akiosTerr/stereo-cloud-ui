import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const envDir = path.resolve(process.cwd())
  const env = loadEnv(mode, envDir, '')
  Object.assign(process.env, env)
  return {
    plugins: [react()],
    envPrefix: 'VITE_',
    envDir,
  }
})
