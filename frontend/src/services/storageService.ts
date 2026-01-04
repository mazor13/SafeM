import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { compressImage } from '../utils/imageCompression';

export interface UploadResult {
  url: string;
  path: string;
  fileName: string;
}

export async function uploadFindingImage(
  clientId: string,
  findingId: string,
  file: File
): Promise<UploadResult> {
  const compressedFile = await compressImage(file);
  
  const timestamp = Date.now();
  const fileName = `${timestamp}_${compressedFile.name}`;
  const path = `clients/${clientId}/findings/${findingId}/${fileName}`;
  
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, compressedFile);
  
  const url = await getDownloadURL(storageRef);
  
  return { url, path, fileName };
}

export async function uploadMultipleFindingImages(
  clientId: string,
  findingId: string,
  files: File[],
  onProgress?: (current: number, total: number) => void
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];
  
  for (let i = 0; i < files.length; i++) {
    if (onProgress) onProgress(i + 1, files.length);
    const result = await uploadFindingImage(clientId, findingId, files[i]);
    results.push(result);
  }
  
  return results;
}
