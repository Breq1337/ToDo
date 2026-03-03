/**
 * Copia .next/static e public para dentro de .next/standalone.
 * Necessário para deploy standalone (ex.: Hostinger) quando o comando de build
 * é apenas "npm run build". Funciona em Windows e Linux.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const standaloneDir = path.join(root, '.next', 'standalone');
const staticSrc = path.join(root, '.next', 'static');
const staticDest = path.join(standaloneDir, '.next', 'static');
const publicSrc = path.join(root, 'public');
const publicDest = path.join(standaloneDir, 'public');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return false;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
  return true;
}

if (!fs.existsSync(standaloneDir)) {
  console.warn('copy-standalone: .next/standalone não encontrado (next build com output: "standalone"?). Ignorando.');
  process.exit(0);
}

if (copyRecursive(staticSrc, staticDest)) {
  console.log('copy-standalone: .next/static copiado para standalone.');
} else {
  console.warn('copy-standalone: .next/static não encontrado.');
}

if (copyRecursive(publicSrc, publicDest)) {
  console.log('copy-standalone: public copiado para standalone.');
}
