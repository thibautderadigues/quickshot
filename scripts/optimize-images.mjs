import sharp from 'sharp';
import { readdir, stat, unlink } from 'fs/promises';
import { join, extname, basename } from 'path';

const DIRS = [
  'src/assets',
  'src/assets/backgrounds',
  'src/assets/thumbnails',
];

const QUALITY = {
  backgrounds: 85,
  thumbnails: 80,
  default: 85,
};

function getQuality(dir) {
  if (dir.includes('thumbnails')) return QUALITY.thumbnails;
  if (dir.includes('backgrounds')) return QUALITY.backgrounds;
  return QUALITY.default;
}

async function convertDir(dir) {
  const quality = getQuality(dir);
  let files;
  try {
    files = await readdir(dir);
  } catch {
    return;
  }

  const pngs = files.filter(f => ['.png', '.jpg', '.jpeg'].includes(extname(f).toLowerCase()));

  for (const file of pngs) {
    const inputPath = join(dir, file);
    const ext = extname(file);
    const rawName = basename(file, ext);
    const safeName = rawName.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/_+/g, '_');
    const outputPath = join(dir, safeName + '.webp');

    const info = await stat(inputPath);
    const sizeMB = (info.size / 1024 / 1024).toFixed(2);

    await sharp(inputPath)
      .webp({ quality })
      .toFile(outputPath);

    const outInfo = await stat(outputPath);
    const outSizeMB = (outInfo.size / 1024 / 1024).toFixed(2);
    const reduction = ((1 - outInfo.size / info.size) * 100).toFixed(0);

    console.log(`${file} → ${basename(outputPath)}  |  ${sizeMB}MB → ${outSizeMB}MB  (-${reduction}%) — PNG deleted`);
    await unlink(inputPath);
  }
}

console.log('Converting PNG → WebP...\n');
for (const dir of DIRS) {
  await convertDir(dir);
}
console.log('\nDone!');
