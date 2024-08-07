// Function to decrypt a file
export async function decryptFile(encryptedBlob) {
    // Convert encryptedBlob to Uint8Array
    const encryptedData = await encryptedBlob.arrayBuffer();
    const encryptedBytes = new Uint8Array(encryptedData);

    // Split IV and encrypted data
    const ivBytes = encryptedBytes.slice(0, 12); // IV length is 12 bytes
    const encryptedBytesOnly = encryptedBytes.slice(12);

    // Decrypt using the imported key and IV
    const decrypted = await window.crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: ivBytes,
        },
        key,
        encryptedBytesOnly
    );

    // Create a Blob from the decrypted data
    const decryptedBlob = new Blob([decrypted], { type: encryptedBlob.type });
    return decryptedBlob;
}

// Function to decrypt user encryption key with passphrase
export async function decryptWithPassphrase(encryptedData, passphrase) {
    const salt = encryptedData.slice(0, 16);
  const iv = encryptedData.slice(16, 28);
  const encryptedKey = encryptedData.slice(28);

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
      iv: iv
    },
    derivedKey,
    encryptedKey
  );

  return new TextDecoder().decode(decryptedKey);
}