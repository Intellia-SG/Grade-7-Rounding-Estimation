import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const audioDir = path.join(__dirname, '../public/assets/audio');
const mapFile = path.join(__dirname, '../src/utils/audioMap.js');

async function clean() {
  if (!fs.existsSync(audioDir) || !fs.existsSync(mapFile)) {
    console.log('Nothing to clean.');
    return;
  }

  const { audioMap } = await import('../src/utils/audioMap.js');
  const validFiles = new Set(Object.values(audioMap).map(p => path.basename(p)));

  const files = fs.readdirSync(audioDir);
  let removed = 0;

  files.forEach(file => {
    if (file.endsWith('.mp3') && !validFiles.has(file)) {
      fs.unlinkSync(path.join(audioDir, file));
      console.log(`Removed orphaned audio: ${file}`);
      removed++;
    }
  });

  console.log(`Audio cleanup complete. Removed ${removed} files.`);
}

clean();
