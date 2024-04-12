
// web
// export const refreshToken = sessionStorage.getItem('refreshToken');
// export const clientId = sessionStorage.getItem('clientId');

// mobile
export const refreshToken = await SecureStore.getItemAsync('refreshToken');
export const clientId = await SecureStore.getItemAsync('clientId');