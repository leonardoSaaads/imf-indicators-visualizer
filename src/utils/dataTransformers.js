// src/utils/dataTransformers.js
/**
 * Transforma dados da API IMF para formato de gráfico
 */
export const transformIMFDataForChart = (apiData, indicator, entities, periods) => {
  if (!apiData?.values?.[indicator]) return [];

  const chartData = [];
  
  periods.forEach(period => {
    const dataPoint = { period };
    
    entities.forEach(entity => {
      const entityData = apiData.values[indicator][entity];
      if (entityData && entityData[period] !== undefined) {
        dataPoint[entity] = parseFloat(entityData[period]);
      }
    });
    
    // Só adiciona se tem pelo menos um valor
    if (Object.keys(dataPoint).length > 1) {
      chartData.push(dataPoint);
    }
  });

  return chartData;
};

/**
 * Calcula métricas estatísticas básicas
 */
export const calculateMetrics = (data, entity) => {
  if (!data || data.length === 0) return null;

  const values = data
    .map(d => d[entity])
    .filter(v => v !== undefined && !isNaN(v));

  if (values.length === 0) return null;

  const sum = values.reduce((acc, val) => acc + val, 0);
  const avg = sum / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  // Variação percentual (primeiro vs último)
  const firstValue = values[0];
  const lastValue = values[values.length - 1];
  const totalChange = firstValue !== 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;

  return {
    average: avg,
    minimum: min,
    maximum: max,
    totalChange,
    count: values.length
  };
};

/**
 * Formata valores numéricos para exibição
 */
export const formatValue = (value, unit = '') => {
  if (value === undefined || value === null || isNaN(value)) return '-';
  
  const num = parseFloat(value);
  
  // Valores muito grandes
  if (Math.abs(num) >= 1e12) {
    return `${(num / 1e12).toFixed(2)}T ${unit}`.trim();
  }
  if (Math.abs(num) >= 1e9) {
    return `${(num / 1e9).toFixed(2)}B ${unit}`.trim();
  }
  if (Math.abs(num) >= 1e6) {
    return `${(num / 1e6).toFixed(2)}M ${unit}`.trim();
  }
  if (Math.abs(num) >= 1e3) {
    return `${(num / 1e3).toFixed(2)}K ${unit}`.trim();
  }
  
  // Valores decimais
  if (Math.abs(num) < 1 && Math.abs(num) > 0) {
    return `${num.toFixed(4)} ${unit}`.trim();
  }
  
  return `${num.toLocaleString()} ${unit}`.trim();
};

/**
 * Formata percentuais
 */
export const formatPercentage = (value, decimals = 2) => {
  if (value === undefined || value === null || isNaN(value)) return '-';
  const num = parseFloat(value);
  return `${num.toFixed(decimals)}%`;
};

/**
 * Gera cores para gráficos
 */
export const generateColors = (count) => {
  const baseColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];
  
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length]);
  }
  
  return colors;
};