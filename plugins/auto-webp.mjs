import sharp from 'sharp';
import { readdir, stat, unlink } from 'fs/promises';
import { join, extname, basename } from 'path';

const WATCHED_DIRS = [
  'src/assets',
  'src/assets/backgrounds',
  'src/assets/thumbnails',
];

const QUALITY = {
  backgrounds: 85,
  thumbnails: 80,
  default: 85,
};

function getQuality(filePath) {
  if (filePath.includes('thumbnails')) return QUALITY.thumbnails;
  if (filePath.includes('backgrounds')) return QUALITY.backgrounds;
  return QUALITY.default;
}

function sanitize(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/_+/g, '_');
}

async function convertAndClean(pngPath) {
  const quality = getQuality(pngPath);
  const dir = pngPath.substring(0, pngPath.lastIndexOf('/') + 1);
  const rawName = basename(pngPath, extname(pngPath));
  const safeName = sanitize(rawName);
  const webpPath = join(dir, safeName + '.webp');

  try {
    await sharp(pngPath).webp({ quality }).toFile(webpPath);
    const before = (await stat(pngPath)).size;
    const after = (await stat(webpPath)).size;
    const reduction = ((1 - after / before) * 100).toFixed(0);
    console.log(`[auto-webp] ${basename(pngPath)} → ${basename(webpPath)} (-${reduction}%) — PNG deleted`);
    await unlink(pngPath);
  } catch (e) {
    if (e.code !== 'ENOENT') {
      console.error(`[auto-webp] Failed: ${pngPath}`, e.message);
    }
  }
}

const SOURCE_EXTS = ['.png', '.jpg', '.jpeg'];

function isSourceImage(filePath) {
  return SOURCE_EXTS.includes(extname(filePath).toLowerCase());
}

async function convertAllExisting() {
  for (const dir of WATCHED_DIRS) {
    let files;
    try {
      files = await readdir(dir);
    } catch {
      continue;
    }
    for (const file of files.filter(f => isSourceImage(f))) {
      await convertAndClean(join(dir, file));
    }
  }
}

export default function autoWebp() {
  return {
    name: 'auto-webp',
    async buildStart() {
      await convertAllExisting();
    },
    configureServer(server) {
      server.watcher.on('add', async (filePath) => {
        if (isSourceImage(filePath)) {
          const isWatched = WATCHED_DIRS.some(dir => filePath.includes(dir));
          if (isWatched) {
            await new Promise(r => setTimeout(r, 200));
            await convertAndClean(filePath);
          }
        }
      });
    },
  };
}
