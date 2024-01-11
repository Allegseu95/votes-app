import { LS } from '@/constants';
import { storage } from './storage';

/**
 * Custom fetch
 * @param {string} endpoint
 * @param {object} options
 * @param {string} options.method
 * @param {object} options.headers
 * @param {object} options.body
 * @param {object} options.file
 * @param {string} options.keyFile
 * @returns {Promise}
 */
export const customFetch = async (endpoint, options) => {
  const BASE_API = import.meta.env.VITE_API;
  const url = BASE_API + endpoint;

  let token = '';
  if (typeof window !== 'undefined') {
    token = storage.get(LS.token) || '';
  }

  const defaultHeader = {
    Accept: 'application/json',
    authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const controller = new AbortController();
  options.signal = controller.signal;

  options.method = options.method || 'GET';
  options.headers = options.headers ? { ...defaultHeader, ...options.headers } : defaultHeader;

  options.body = JSON.stringify(options.body) || false;

  if (!options.body) delete options.body;

  try {
    const res = await fetch(url, options);
    return await res.json();
  } catch (err) {
    return {
      message: 'Servicio no disponible!',
      error: true,
      data: null,
      status: 500,
    };
  }
};
