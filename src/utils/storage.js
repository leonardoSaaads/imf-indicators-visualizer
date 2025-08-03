// src/utils/storage.js
/**
 * Utilitários para localStorage (apenas sugestão, não usar em artifacts)
 */
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.warn('Não foi possível salvar no localStorage');
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      console.warn('Não foi possível remover do localStorage');
    }
  }
};