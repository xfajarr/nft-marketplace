import { PinataSDK } from 'pinata';

// Initialize Pinata SDK with environment variables
const pinata = new PinataSDK({
  pinataJwt: import.meta.env.VITE_PINATA_JWT,
  pinataGateway: import.meta.env.VITE_PINATA_GATEWAY_URL
});

/**
 * Validates file before upload
 */
export function validateFileForUpload(file: File): void {
  // Check file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed');
  }

  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('File size must be less than 10MB');
  }

  console.log('✅ File validation passed:', {
    name: file.name,
    type: file.type,
    size: `${(file.size / 1024 / 1024).toFixed(2)}MB`
  });
}

/**
 * Uploads a file to Pinata IPFS using the new SDK
 */
export async function uploadFileToPinata(file: File): Promise<{ cid: string; gatewayUrl: string }> {
  console.log('🚀 Starting Pinata upload for file:', file.name);

  try {
    // Validate file first
    validateFileForUpload(file);

    console.log('📡 Getting presigned URL from Pinata...');
    
    // Upload file using Pinata SDK
    const upload = await pinata.upload.public.file(file);
    
    console.log('📤 File uploaded to IPFS:', {
      cid: upload.cid,
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`
    });

    if (!upload.cid) {
      throw new Error('Upload failed - no CID returned');
    }

    console.log('🔗 Converting CID to gateway URL...');
    
    // Convert CID to gateway URL
    const gatewayUrl = await pinata.gateways.public.convert(upload.cid);
    
    console.log('✅ Pinata upload successful!', {
      cid: upload.cid,
      gatewayUrl,
      originalFileName: file.name
    });

    return {
      cid: upload.cid,
      gatewayUrl
    };

  } catch (error) {
    console.error('❌ Pinata upload failed:', {
      error: error instanceof Error ? error.message : String(error),
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      stack: error instanceof Error ? error.stack : undefined
    });
    
    throw new Error(`Pinata upload failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Test Pinata connection
 */
export async function testPinataConnection(): Promise<boolean> {
  try {
    console.log('🔍 Testing Pinata connection...');
    
    // Test by trying to get gateway info
    const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    const upload = await pinata.upload.public.file(testFile);
    
    console.log('✅ Pinata connection test successful:', upload.cid);
    return true;
  } catch (error) {
    console.error('❌ Pinata connection test failed:', error);
    return false;
  }
}

export default pinata;