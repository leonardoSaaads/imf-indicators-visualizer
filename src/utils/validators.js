// src/utils/validators.js
/**
 * Valida seleções do usuário
 */
export const validateSelection = (indicator, entities, periods) => {
  const errors = [];
  
  if (!indicator) {
    errors.push('Selecione um indicador');
  }
  
  if (!entities || entities.length === 0) {
    errors.push('Selecione pelo menos um país, região ou grupo');
  }
  
  if (!periods || periods.length === 0) {
    errors.push('Selecione pelo menos um período');
  }
  
  if (entities && entities.length > 10) {
    errors.push('Máximo de 10 entidades permitidas');
  }
  
  if (periods && periods.length > 50) {
    errors.push('Máximo de 50 períodos permitidos');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Valida ano
 */
export const validateYear = (year) => {
  const currentYear = new Date().getFullYear();
  const minYear = 1980;
  const numYear = parseInt(year);
  
  if (isNaN(numYear)) return false;
  if (numYear < minYear || numYear > currentYear) return false;
  
  return true;
};