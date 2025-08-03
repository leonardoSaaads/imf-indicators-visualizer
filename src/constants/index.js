// src/constants/index.js
export const CHART_TYPES = {
  LINE: 'line',
  BAR: 'bar',
  AREA: 'area',
  COMPOSED: 'composed'
};

export const ENTITY_TYPES = {
  COUNTRY: 'country',
  REGION: 'region',
  GROUP: 'group'
};

export const DEFAULT_COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
  '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
];

export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const API_LIMITS = {
  MAX_ENTITIES: 10,
  MAX_PERIODS: 50,
  MAX_CONCURRENT_REQUESTS: 3
};
