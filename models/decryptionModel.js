// Function to decrypt a file
export async function decryptFile(encryptedBlob, key) {
  try {
    console.log(key);
    // Convert encryptedBlob to ArrayBuffer
    const encryptedData = await encryptedBlob.arrayBuffer();
    const encryptedBytes = new Uint8Array(encryptedData);

    // Extract IV and encrypted data
    const ivBytes = encryptedBytes.slice(0, 12); // IV length is 12 bytes
    const encryptedBytesOnly = encryptedBytes.slice(12);

    // Decrypt using the imported key and IV
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: ivBytes,
        tagLength: 128, // Ensure this matches the encryption tag length
      },
      key,
      encryptedBytesOnly
    );

    // Create a Blob from the decrypted data
    const decryptedBlob = new Blob([decrypted], { type: encryptedBlob.type });
    return decryptedBlob;

  } catch (error) {
    console.error('Error decrypting file:', error);
    throw new Error('Error decrypting file: ' + error.message);
  }
}


export async function decryptWithPassphrase(encryptedKeyString, passphrase) {
  console.log(typeof encryptedKeyString);
  const decodedString = atob(encryptedKeyString);
  // Decode base64 string to Uint8Array
  const encryptedKeyBuffer = new Uint8Array(decodedString.split('').map(char => char.charCodeAt(0)));
  console.log(encryptedKeyBuffer);
  console.log(typeof encryptedKeyBuffer);
  console.log(encryptedKeyBuffer instanceof Uint8Array);
  console.log(encryptedKeyBuffer.length);

  // Extract components
  const salt = new Uint8Array(encryptedKeyBuffer.slice(0, 16));
  const iv = new Uint8Array(encryptedKeyBuffer.slice(16, 28));
  const data = encryptedKeyBuffer.slice(28); 

  console.log(salt.length);
  console.log(iv.length);
  console.log(data.byteLength);

  // Ensure data length is valid
  if (data.byteLength < 1) {
    throw new Error('Encrypted key data is too small.');
  }

  try {
    const enc = new TextEncoder();
    const passphraseKey = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(passphrase),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    const derivedKey = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      passphraseKey,
      { name: 'AES-GCM', length: 256 },
      true,
      ['decrypt']
    );

    const decryptedKey = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
        tagLength: 128 // Ensure this matches the encryption tag length
      },
      derivedKey,
      data
    );

    const encryptionKey = await window.crypto.subtle.importKey(
      'raw',
      decryptedKey,
      { name: 'AES-GCM' },
      true,
      ['encrypt', 'decrypt']
    );

    return encryptionKey;
  } catch (error) {
    console.error('Error during decryption:', error);
    throw new Error('Error during decryption: ' + error.message);
  }
}