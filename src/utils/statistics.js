// src/utils/statistics.js

/**
 * Utilitário para cálculos estatísticos avançados
 * Implementa funções robustas para análise de dados econômicos
 */

/**
 * Remove valores nulos/indefinidos de um array
 * @param {Array} data - Array de dados
 * @returns {Array} Array limpo
 */
const cleanData = (data) => {
  return data.filter(value => 
    value !== null && 
    value !== undefined && 
    !isNaN(value) && 
    isFinite(value)
  ).map(Number);
};

/**
 * Calcula estatísticas básicas
 * @param {Array} data - Array de números
 * @returns {Object} Estatísticas básicas
 */
export const calculateBasicStats = (data) => {
  const cleanedData = cleanData(data);
  
  if (cleanedData.length === 0) {
    return {
      count: 0,
      mean: null,
      median: null,
      mode: null,
      min: null,
      max: null,
      range: null
    };
  }

  const sorted = [...cleanedData].sort((a, b) => a - b);
  const n = cleanedData.length;
  const sum = cleanedData.reduce((acc, val) => acc + val, 0);
  const mean = sum / n;
  
  // Mediana
  const median = n % 2 === 0 
    ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
    : sorted[Math.floor(n / 2)];

  // Moda (valor mais frequente)
  const frequency = {};
  cleanedData.forEach(val => {
    frequency[val] = (frequency[val] || 0) + 1;
  });
  const maxFreq = Math.max(...Object.values(frequency));
  const modes = Object.keys(frequency)
    .filter(key => frequency[key] === maxFreq)
    .map(Number);
  const mode = modes.length === cleanedData.length ? null : modes[0];

  return {
    count: n,
    mean: Number(mean.toFixed(6)),
    median: Number(median.toFixed(6)),
    mode: mode ? Number(mode.toFixed(6)) : null,
    min: Number(sorted[0].toFixed(6)),
    max: Number(sorted[n - 1].toFixed(6)),
    range: Number((sorted[n - 1] - sorted[0]).toFixed(6))
  };
};

/**
 * Calcula quartis e estatísticas relacionadas
 * @param {Array} data - Array de números
 * @returns {Object} Quartis e IQR
 */
export const calculateQuartiles = (data) => {
  const cleanedData = cleanData(data);
  
  if (cleanedData.length === 0) {
    return {
      q1: null,
      q2: null,
      q3: null,
      iqr: null
    };
  }

  const sorted = [...cleanedData].sort((a, b) => a - b);
  const n = sorted.length;

  const getPercentile = (percentile) => {
    const index = (percentile / 100) * (n - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index % 1;
    
    if (upper >= n) return sorted[n - 1];
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  };

  const q1 = getPercentile(25);
  const q2 = getPercentile(50); // Mediana
  const q3 = getPercentile(75);
  const iqr = q3 - q1;

  return {
    q1: Number(q1.toFixed(6)),
    q2: Number(q2.toFixed(6)),
    q3: Number(q3.toFixed(6)),
    iqr: Number(iqr.toFixed(6))
  };
};

/**
 * Calcula variância e desvio padrão
 * @param {Array} data - Array de números
 * @param {boolean} sample - Se true, calcula variância amostral
 * @returns {Object} Variância e desvio padrão
 */
export const calculateVarianceStats = (data, sample = true) => {
  const cleanedData = cleanData(data);
  
  if (cleanedData.length === 0) {
    return {
      variance: null,
      standardDeviation: null,
      coefficientOfVariation: null
    };
  }

  const n = cleanedData.length;
  if (sample && n < 2) {
    return {
      variance: null,
      standardDeviation: null,
      coefficientOfVariation: null
    };
  }

  const mean = cleanedData.reduce((sum, val) => sum + val, 0) / n;
  const squaredDiffs = cleanedData.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / (sample ? n - 1 : n);
  const standardDeviation = Math.sqrt(variance);
  const coefficientOfVariation = mean !== 0 ? Math.abs(standardDeviation / mean) : null;

  return {
    variance: Number(variance.toFixed(6)),
    standardDeviation: Number(standardDeviation.toFixed(6)),
    coefficientOfVariation: coefficientOfVariation ? Number(coefficientOfVariation.toFixed(6)) : null
  };
};

/**
 * Calcula assimetria (skewness)
 * @param {Array} data - Array de números
 * @returns {number|null} Coeficiente de assimetria
 */
export const calculateSkewness = (data) => {
  const cleanedData = cleanData(data);
  const n = cleanedData.length;
  
  if (n < 3) return null;

  const mean = cleanedData.reduce((sum, val) => sum + val, 0) / n;
  const variance = cleanedData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);
  
  if (stdDev === 0) return null;

  const skewness = cleanedData.reduce((sum, val) => {
    return sum + Math.pow((val - mean) / stdDev, 3);
  }, 0) / n;

  return Number(skewness.toFixed(6));
};

/**
 * Calcula curtose
 * @param {Array} data - Array de números
 * @returns {number|null} Coeficiente de curtose
 */
export const calculateKurtosis = (data) => {
  const cleanedData = cleanData(data);
  const n = cleanedData.length;
  
  if (n < 4) return null;

  const mean = cleanedData.reduce((sum, val) => sum + val, 0) / n;
  const variance = cleanedData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);
  
  if (stdDev === 0) return null;

  const kurtosis = cleanedData.reduce((sum, val) => {
    return sum + Math.pow((val - mean) / stdDev, 4);
  }, 0) / n;

  return Number((kurtosis - 3).toFixed(6)); // Excess kurtosis
};

/**
 * Calcula Z-scores para detecção de outliers
 * @param {Array} data - Array de números
 * @param {number} threshold - Limiar para considerar outlier (padrão: 2.5)
 * @returns {Object} Z-scores e outliers
 */
export const calculateZScores = (data, threshold = 2.5) => {
  const cleanedData = cleanData(data);
  
  if (cleanedData.length === 0) {
    return {
      zScores: [],
      outliers: [],
      outlierIndices: []
    };
  }

  const mean = cleanedData.reduce((sum, val) => sum + val, 0) / cleanedData.length;
  const variance = cleanedData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / cleanedData.length;
  const stdDev = Math.sqrt(variance);
  
  const zScores = cleanedData.map(val => stdDev === 0 ? 0 : (val - mean) / stdDev);
  const outlierIndices = [];
  const outliers = [];
  
  zScores.forEach((zScore, index) => {
    if (Math.abs(zScore) > threshold) {
      outlierIndices.push(index);
      outliers.push({
        value: cleanedData[index],
        zScore: Number(zScore.toFixed(6)),
        index
      });
    }
  });

  return {
    zScores: zScores.map(score => Number(score.toFixed(6))),
    outliers,
    outlierIndices,
    threshold
  };
};

/**
 * Calcula autocorrelação com lag 1
 * @param {Array} data - Array de números (série temporal)
 * @returns {number|null} Coeficiente de autocorrelação
 */
export const calculateAutocorrelation = (data, lag = 1) => {
  const cleanedData = cleanData(data);
  const n = cleanedData.length;
  
  if (n <= lag) return null;

  const mean = cleanedData.reduce((sum, val) => sum + val, 0) / n;
  
  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < n - lag; i++) {
    numerator += (cleanedData[i] - mean) * (cleanedData[i + lag] - mean);
  }
  
  for (let i = 0; i < n; i++) {
    denominator += Math.pow(cleanedData[i] - mean, 2);
  }
  
  if (denominator === 0) return null;
  
  const autocorrelation = numerator / denominator;
  return Number(autocorrelation.toFixed(6));
};

/**
 * Calcula entropia de Shannon (medida de incerteza/dispersão)
 * @param {Array} data - Array de números
 * @param {number} bins - Número de bins para histograma
 * @returns {number|null} Entropia
 */
export const calculateEntropy = (data, bins = 10) => {
  const cleanedData = cleanData(data);
  
  if (cleanedData.length === 0) return null;

  const min = Math.min(...cleanedData);
  const max = Math.max(...cleanedData);
  const range = max - min;
  
  if (range === 0) return 0;

  const binSize = range / bins;
  const histogram = new Array(bins).fill(0);
  
  cleanedData.forEach(val => {
    const binIndex = Math.min(Math.floor((val - min) / binSize), bins - 1);
    histogram[binIndex]++;
  });
  
  const n = cleanedData.length;
  const entropy = histogram.reduce((sum, count) => {
    if (count === 0) return sum;
    const probability = count / n;
    return sum - probability * Math.log2(probability);
  }, 0);
  
  return Number(entropy.toFixed(6));
};

/**
 * Calcula todas as estatísticas para um dataset
 * @param {Array} data - Array de números
 * @param {string} label - Rótulo dos dados
 * @returns {Object} Todas as estatísticas
 */
export const calculateAllStatistics = (data, label = '') => {
  const basicStats = calculateBasicStats(data);
  const quartiles = calculateQuartiles(data);
  const varianceStats = calculateVarianceStats(data);
  const skewness = calculateSkewness(data);
  const kurtosis = calculateKurtosis(data);
  const zScores = calculateZScores(data);
  const autocorrelation = calculateAutocorrelation(data);
  const entropy = calculateEntropy(data);

  return {
    label,
    basic: basicStats,
    quartiles,
    variance: varianceStats,
    distribution: {
      skewness,
      kurtosis,
      entropy
    },
    outliers: {
      zScores: zScores.zScores,
      outlierCount: zScores.outliers.length,
      outliers: zScores.outliers
    },
    timeSeries: {
      autocorrelation
    }
  };
};

/**
 * Formata estatísticas para exibição
 * @param {Object} stats - Objeto de estatísticas
 * @returns {Array} Array formatado para exibição
 */
export const formatStatisticsForDisplay = (stats) => {
  const formatValue = (value, decimals = 2) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value !== 'number') return value;
    return value.toLocaleString('pt-BR', { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: decimals 
    });
  };

  return [
    // Estatísticas Básicas
    { category: 'Básicas', metric: 'Contagem', value: formatValue(stats.basic.count, 0), description: 'Número total de observações' },
    { category: 'Básicas', metric: 'Média', value: formatValue(stats.basic.mean), description: 'Valor médio dos dados' },
    { category: 'Básicas', metric: 'Mediana', value: formatValue(stats.basic.median), description: 'Valor central dos dados' },
    { category: 'Básicas', metric: 'Moda', value: formatValue(stats.basic.mode), description: 'Valor mais frequente' },
    { category: 'Básicas', metric: 'Amplitude', value: formatValue(stats.basic.range), description: 'Diferença entre máximo e mínimo' },
    
    // Quartis
    { category: 'Quartis', metric: 'Q1 (25%)', value: formatValue(stats.quartiles.q1), description: 'Primeiro quartil' },
    { category: 'Quartis', metric: 'Q2 (50%)', value: formatValue(stats.quartiles.q2), description: 'Segundo quartil (mediana)' },
    { category: 'Quartis', metric: 'Q3 (75%)', value: formatValue(stats.quartiles.q3), description: 'Terceiro quartil' },
    { category: 'Quartis', metric: 'IQR', value: formatValue(stats.quartiles.iqr), description: 'Intervalo interquartil' },
    
    // Variabilidade
    { category: 'Variabilidade', metric: 'Variância', value: formatValue(stats.variance.variance), description: 'Medida de dispersão dos dados' },
    { category: 'Variabilidade', metric: 'Desvio Padrão', value: formatValue(stats.variance.standardDeviation), description: 'Raiz quadrada da variância' },
    { category: 'Variabilidade', metric: 'Coef. Variação', value: formatValue(stats.variance.coefficientOfVariation, 4), description: 'Variabilidade relativa à média' },
    
    // Distribuição
    { category: 'Distribuição', metric: 'Assimetria', value: formatValue(stats.distribution.skewness, 4), description: 'Simetria da distribuição' },
    { category: 'Distribuição', metric: 'Curtose', value: formatValue(stats.distribution.kurtosis, 4), description: 'Forma da distribuição' },
    { category: 'Distribuição', metric: 'Entropia', value: formatValue(stats.distribution.entropy, 4), description: 'Medida de incerteza' },
    
    // Outliers
    { category: 'Outliers', metric: 'Quantidade', value: formatValue(stats.outliers.outlierCount, 0), description: 'Número de valores atípicos' },
    
    // Série Temporal
    { category: 'Temporal', metric: 'Autocorrelação', value: formatValue(stats.timeSeries.autocorrelation, 4), description: 'Correlação temporal (lag=1)' }
  ];
};