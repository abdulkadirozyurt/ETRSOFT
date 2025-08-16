import axios from "axios";

// Ortama göre taban URL'i belirleyen fonksiyon
const resolveBaseURL = () => {
  const explicitMode = import.meta.env.VITE_APP_MODE; // manuel override
  const mode = explicitMode || import.meta.env.MODE;
  const prod = import.meta.env.VITE_PROD_API_URL;
  const dev = import.meta.env.VITE_DEV_API_URL;
  // Öncelik: production mode belirtilmişse prod URL, değilse dev, değilse fallback
  if (mode === 'production' && prod) return prod;
  if (dev) return dev;
  return '/api';
};

export const apiBaseURL = resolveBaseURL();

export const api = axios.create({
  baseURL: apiBaseURL,
  timeout: 30000,
});


