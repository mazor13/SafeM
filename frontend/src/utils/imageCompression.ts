import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  quality?: number;
}

const defaultOptions: CompressionOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  quality: 0.8,
};

export async function compressImage(
  file: File, 
  options: CompressionOptions = {}
): Promise<File> {
  const opts = { ...defaultOptions, ...options };
  
  if (file.size <= (opts.maxSizeMB! * 1024 * 1024)) {
    console.log(`Image ${file.name} is already small enough (${(file.size / 1024).toFixed(1)}KB)`);
    return file;
  }
  
  console.log(`Compressing ${file.name}: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
  
  try {
    const compressedFile = await imageCompression(file, {
      maxSizeMB: opts.maxSizeMB!,
      maxWidthOrHeight: opts.maxWidthOrHeight!,
      useWebWorker: true,
      fileType: 'image/jpeg',
    });
    
    console.log(`Compressed to: ${(compressedFile.size / 1024).toFixed(1)}KB`);
    
    const newFileName = file.name.replace(/\.[^/.]+$/, '.jpg');
    return new File([compressedFile], newFileName, { type: 'image/jpeg' });
    
  } catch (error) {
    console.error('Compression failed:', error);
    throw error;
  }
}
