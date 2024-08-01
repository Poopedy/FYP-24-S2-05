// Function to generate a random string
export const generate256BitKey = async () => {
    const keyMaterial = await window.crypto.subtle.generateKey(
        {
            name: 'AES-GCM',
            length: 256,
        },
        true,
        ['encrypt', 'decrypt']
    );
    return keyMaterial;
};
