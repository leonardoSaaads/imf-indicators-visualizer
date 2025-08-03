// src/hooks/useIMFData.js
import { useState, useEffect, useRef, useCallback } from 'react';
import imfApi from '../services/imfApi';

/**
 * Hook for caching API responses
 */
export const useCache = () => {
  const cache = useRef(new Map());
  
  const getCached = useCallback((key) => {
    const cached = cache.current.get(key);
    if (cached && Date.now() - cached.timestamp < 300000) { // 5 minutes cache
      return cached.data;
    }
    return null;
  }, []);
  
  const setCache = useCallback((key, data) => {
    cache.current.set(key, {
      data,
      timestamp: Date.now()
    });
  }, []);
  
  return { getCached, setCache };
};

/**
 * Hook for fetching indicators
 */
export const useIndicators = () => {
  const [indicators, setIndicators] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getCached, setCache } = useCache();

  const fetchIndicators = useCallback(async () => {
    const cacheKey = 'indicators';
    const cached = getCached(cacheKey);
    
    if (cached) {
      setIndicators(cached.indicators);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await imfApi.getIndicators();
      setIndicators(data.indicators);
      setCache(cacheKey, data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getCached, setCache]);

  useEffect(() => {
    fetchIndicators();
  }, [fetchIndicators]);

  return { indicators, loading, error, refetch: fetchIndicators };
};

/**
 * Hook for fetching countries
 */
export const useCountries = () => {
  const [countries, setCountries] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getCached, setCache } = useCache();

  const fetchCountries = useCallback(async () => {
    const cacheKey = 'countries';
    const cached = getCached(cacheKey);
    
    if (cached) {
      setCountries(cached.countries);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await imfApi.getCountries();
      setCountries(data.countries);
      setCache(cacheKey, data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getCached, setCache]);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  return { countries, loading, error, refetch: fetchCountries };
};

/**
 * Hook for fetching regions
 */
export const useRegions = () => {
  const [regions, setRegions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getCached, setCache } = useCache();

  const fetchRegions = useCallback(async () => {
    const cacheKey = 'regions';
    const cached = getCached(cacheKey);
    
    if (cached) {
      setRegions(cached.regions);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await imfApi.getRegions();
      setRegions(data.regions);
      setCache(cacheKey, data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getCached, setCache]);

  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);

  return { regions, loading, error, refetch: fetchRegions };
};

/**
 * Hook for fetching groups
 */
export const useGroups = () => {
  const [groups, setGroups] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getCached, setCache } = useCache();

  const fetchGroups = useCallback(async () => {
    const cacheKey = 'groups';
    const cached = getCached(cacheKey);
    
    if (cached) {
      setGroups(cached.groups);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await imfApi.getGroups();
      setGroups(data.groups);
      setCache(cacheKey, data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getCached, setCache]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return { groups, loading, error, refetch: fetchGroups };
};

/**
 * Hook for fetching time series data
 */
export const useTimeSeries = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getCached, setCache } = useCache();

  const fetchTimeSeries = useCallback(async (indicatorId, entities = [], periods = []) => {
    const cacheKey = `timeseries-${indicatorId}-${entities.join(',')}-${periods.join(',')}`;
    const cached = getCached(cacheKey);
    
    if (cached) {
      setData(cached);
      return cached;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await imfApi.getTimeSeries(indicatorId, entities, periods);
      setData(result);
      setCache(cacheKey, result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getCached, setCache]);

  return { data, loading, error, fetchTimeSeries };
};

/**
 * Hook for searching indicators
 */
export const useIndicatorSearch = () => {
  const [searchResults, setSearchResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchIndicators = useCallback(async (keyword) => {
    if (!keyword.trim()) {
      setSearchResults({});
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const results = await imfApi.searchIndicators(keyword);
      setSearchResults(results.indicators);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { searchResults, loading, error, searchIndicators };
};