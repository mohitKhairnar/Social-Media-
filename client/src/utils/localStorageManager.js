// Exporting the KEY_ACCESS_TOKEN with name access_token (Just a name)
export const KEY_ACCESS_TOKEN = "access_token";

export function getItem(key) {
    return localStorage.getItem(key);
}

export function setItem(key, value) {
    localStorage.setItem(key, value);
}

export function removeItem(key) {
    localStorage.removeItem(key);
}