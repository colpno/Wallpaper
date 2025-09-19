if (!import.meta.env.VITE_API_URL) {
  throw new Error('VITE_API_URL is not defined');
}
if (!import.meta.env.VITE_API_VERSION) {
  throw new Error('VITE_API_VERSION is not defined');
}

export const apiVersion = import.meta.env.VITE_API_VERSION;
export const apiURL = `${import.meta.env.VITE_API_URL}/${apiVersion}`;
