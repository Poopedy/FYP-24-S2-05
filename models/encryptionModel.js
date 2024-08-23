export async function encryptFile(file, key) {
  try {
    console.log(key);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    console.log(file instanceof File); // Should be true
    console.log(file instanceof Blob); // Should be true
    console.log(file);
    const encodedFile = await file.arrayBuffer();

    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
        tagLength: 128 // Ensure tag length matches encryption settings
      },
      key,
      encodedFile
    );

    const ivAndEncrypted = new Uint8Array(iv.length + encrypted.byteLength);
    ivAndEncrypted.set(iv);
    ivAndEncrypted.set(new Uint8Array(encrypted), iv.length);

    const encryptedBlob = new Blob([ivAndEncrypted], { type: file.type });

    return { encryptedBlob };
  } catch (error) {
    console.error('Error during encryption:', error);
    throw new Error('Error during encryption: ' + error.message);
  }
}

export async function encryptWithPassphrase(key, passphrase) {
  const enc = new TextEncoder();

  // Convert passphrase to a cryptographic key
  const passphraseKey = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  // Generate a salt
  const salt = window.crypto.getRandomValues(new Uint8Array(16));

  // Derive a key using PBKDF2
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
    ['encrypt']
  );

  // Generate an IV
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Ensure IV is a Uint8Array

  const keyBuffer = await window.crypto.subtle.exportKey('raw', key);

  // Encrypt the user's key
  const encryptedKey = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
      tagLength: 128 // Tag length in bits
    },
    derivedKey,
    keyBuffer
  );

  console.log(salt.length);
  console.log(iv.length);
  console.log(encryptedKey.byteLength);
  console.log(encryptedKey.length);
  // Concatenate salt, iv, and encryptedKey
  const combinedBuffer = new Uint8Array(salt.length + iv.length + encryptedKey.byteLength);
  combinedBuffer.set(salt, 0);
  combinedBuffer.set(iv, salt.length);
  combinedBuffer.set(new Uint8Array(encryptedKey), salt.length + iv.length);

  return combinedBuffer;
}