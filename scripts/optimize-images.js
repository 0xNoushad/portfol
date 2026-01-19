/**
 * Image Optimization Script
 * 
 * This script helps compress images to meet the < 200KB requirement.
 * 
 * Usage:
 * 1. Install sharp: npm install -D sharp
 * 2. Run: node scripts/optimize-images.js
 * 
 * The script will:
 * - Resize images to max 1200px width
 * - Convert to WebP format
 * - Adjust quality to meet size requirements
 * - Preserve original files (creates .webp versions)
 */

import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';

const MAX_SIZE_KB = 200;
const QUALITY_START = 85;
const MAX_WIDTH = 1200;

async function getFileSizeKB(path) {
  const stats = await stat(path);
  return stats.size / 1024;
}

async function optimizeImage(inputPath, outputPath) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log(`Processing ${basename(inputPath)}...`);
    
    let quality = QUALITY_START;
    let output;
    let attempts = 0;
    const maxAttempts = 8;
    
    do {
      output = await image
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality })
        .toBuffer();
      
      const sizeKB = output.length / 1024;
      
      if (sizeKB <= MAX_SIZE_KB) {
        await sharp(output).toFile(outputPath);
        console.log(`✓ Optimized ${basename(inputPath)}: ${sizeKB.toFixed(2)}KB (quality: ${quality})`);
        return true;
      }
      
      quality -= 5;
      attempts++;
    } while (quality >= 50 && attempts < maxAttempts);
    
    // If still too large, save anyway and warn
    await sharp(output).toFile(outputPath);
    const finalSize = output.length / 1024;
    console.log(`⚠ ${basename(inputPath)}: ${finalSize.toFixed(2)}KB (couldn't reach target)`);
    return false;
  } catch (error) {
    console.error(`✗ Failed to optimize ${basename(inputPath)}:`, error.message);
    return false;
  }
}

async function processDirectory(dirPath) {
  console.log(`\nProcessing directory: ${dirPath}`);
  
  const files = await readdir(dirPath);
  const imageFiles = files.filter(file => 
    /\.(png|jpg|jpeg)$/i.test(file)
  );
  
  if (imageFiles.length === 0) {
    console.log('No images found to optimize.');
    return;
  }
  
  console.log(`Found ${imageFiles.length} images to optimize.\n`);
  
  let optimized = 0;
  let failed = 0;
  
  for (const file of imageFiles) {
    const inputPath = join(dirPath, file);
    const currentSize = await getFileSizeKB(inputPath);
    
    // Skip if already under target
    if (currentSize <= MAX_SIZE_KB) {
      console.log(`⊘ Skipping ${file}: already ${currentSize.toFixed(2)}KB`);
      continue;
    }
    
    const outputPath = join(dirPath, file.replace(/\.(png|jpg|jpeg)$/i, '.webp'));
    const success = await optimizeImage(inputPath, outputPath);
    
    if (success) {
      optimized++;
    } else {
      failed++;
    }
  }
  
  console.log(`\nSummary: ${optimized} optimized, ${failed} failed, ${imageFiles.length - optimized - failed} skipped`);
}

// Main execution
async function main() {
  console.log('Image Optimization Script');
  console.log('=========================\n');
  console.log(`Target size: < ${MAX_SIZE_KB}KB`);
  console.log(`Max width: ${MAX_WIDTH}px`);
  console.log(`Format: WebP\n`);
  
  // Process project images
  await processDirectory('public/projects');
  
  // Process interest images
  await processDirectory('public/interests');
  
  // Process root public images
  console.log('\nProcessing root public images...');
  const rootFiles = await readdir('public');
  const rootImages = rootFiles.filter(file => 
    /\.(png|jpg|jpeg)$/i.test(file) && !file.startsWith('favicon')
  );
  
  for (const file of rootImages) {
    const inputPath = join('public', file);
    const currentSize = await getFileSizeKB(inputPath);
    
    if (currentSize <= MAX_SIZE_KB) {
      console.log(`⊘ Skipping ${file}: already ${currentSize.toFixed(2)}KB`);
      continue;
    }
    
    const outputPath = join('public', file.replace(/\.(png|jpg|jpeg)$/i, '.webp'));
    await optimizeImage(inputPath, outputPath);
  }
  
  console.log('\n✓ Optimization complete!');
  console.log('\nNext steps:');
  console.log('1. Review the optimized .webp images');
  console.log('2. Update image references in your code to use .webp files');
  console.log('3. Delete original files if satisfied with quality');
}

main().catch(console.error);
