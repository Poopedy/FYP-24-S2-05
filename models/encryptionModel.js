const hardcodedKey = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]); // Replace with actual key
const hardcodedIV = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]); // Replace with your actual IV

async function getKey() {
    return await window.crypto.subtle.importKey(
        'raw',  // import a raw key
        hardcodedKey.buffer,
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
    );
}

const encryptFile = async (file) => {
    const key = await getKey();

    const iv = hardcodedIV;
    const encodedFile = await file.arrayBuffer();
    const encrypted = await window.crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv,
        },
        key,
        encodedFile
    );

    const encryptedBlob = new Blob([encrypted], { type: file.type });
    return { encryptedBlob, iv };
};

export default encryptFile;