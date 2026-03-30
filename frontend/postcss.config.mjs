import tailwindPlugin from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'

const config = {
  plugins: [tailwindPlugin(), autoprefixer()],
}

export default config;
