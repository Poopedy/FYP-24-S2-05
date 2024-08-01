// Function to encrypt a file
export async function encryptFile(file, key) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedFile = await file.arrayBuffer();
    const encrypted = await window.crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv,
        },
        key,
        encodedFile
    );

    const ivAndEncrypted = new Uint8Array(iv.length + encrypted.byteLength);
    ivAndEncrypted.set(iv);
    ivAndEncrypted.set(new Uint8Array(encrypted), iv.length);

    const encryptedBlob = new Blob([ivAndEncrypted], { type: file.type });
    return { encryptedBlob};
}

// Function to encrypt user key with passphrase
export async function encryptWithPassphrase(key, passphrase) {
    const enc = new TextEncoder();
    // change passphrase to a valid cryptographic key
    const passphraseKey = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(passphrase),
      'PBKDF2',
      false,
      ['deriveKey']
    );
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
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
    // encrypt user encryption key with passphrase key
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encryptedKey = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      derivedKey,
      enc.encode(key)
    );
  
    // Concatenate salt, iv, and encryptedKey
    const combinedBuffer = new Uint8Array(salt.length + iv.length + encryptedKey.byteLength);
    combinedBuffer.set(salt, 0);
    combinedBuffer.set(iv, salt.length);
    combinedBuffer.set(new Uint8Array(encryptedKey), salt.length + iv.length);

    return combinedBuffer;
}