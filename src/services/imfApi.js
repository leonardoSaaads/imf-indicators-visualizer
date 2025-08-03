// src/services/imfApi.js

// Use proxy in development, direct URL in production
const IMF_BASE_URL = import.meta.env.DEV 
  ? '/api/imf' 
  : 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://www.imf.org/external/datamapper/api/v1');

class IMFApiService {
  /**
   * Fetch data from IMF API with error handling
   * @param {string} endpoint - API endpoint
   * @returns {Promise<any>} API response data
   */
  async fetchData(endpoint) {
    try {
      let url;
      
      if (import.meta.env.DEV) {
        // Development: use proxy
        url = `${IMF_BASE_URL}${endpoint}`;
      } else {
        // Production: use CORS proxy
        const targetUrl = `https://www.imf.org/external/datamapper/api/v1${endpoint}`;
        url = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Handle AllOrigins wrapper in production
      if (!import.meta.env.DEV && result.contents) {
        return JSON.parse(result.contents);
      }
      
      return result;
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }

  /**
   * Get all available indicators
   * @returns {Promise<Object>} Indicators data
   */
  async getIndicators() {
    return this.fetchData('/indicators');
  }

  /**
   * Get all countries
   * @returns {Promise<Object>} Countries data
   */
  async getCountries() {
    return this.fetchData('/countries');
  }

  /**
   * Get all regions
   * @returns {Promise<Object>} Regions data
   */
  async getRegions() {
    return this.fetchData('/regions');
  }

  /**
   * Get all groups
   * @returns {Promise<Object>} Groups data
   */
  async getGroups() {
    return this.fetchData('/groups');
  }

  /**
   * Get time series data for specific indicators and countries/regions/groups
   * @param {string} indicatorId - Indicator ID (e.g., 'NGDP_RPCH')
   * @param {string[]} entities - Array of country/region/group codes
   * @param {string[]} periods - Optional array of years (e.g., ['2019', '2020'])
   * @returns {Promise<Object>} Time series data
   */
  async getTimeSeries(indicatorId, entities = [], periods = []) {
    if (!indicatorId) {
      throw new Error('Indicator ID is required');
    }

    let endpoint = `/${indicatorId}`;
    
    if (entities.length > 0) {
      endpoint += `/${entities.join('/')}`;
    }
    
    if (periods.length > 0) {
      endpoint += `?periods=${periods.join(',')}`;
    }

    return this.fetchData(endpoint);
  }

  /**
   * Get time series for multiple indicators
   * @param {Object[]} requests - Array of {indicatorId, entities, periods}
   * @returns {Promise<Object[]>} Array of time series data
   */
  async getMultipleTimeSeries(requests) {
    const promises = requests.map(({ indicatorId, entities, periods }) =>
      this.getTimeSeries(indicatorId, entities, periods)
    );

    try {
      return await Promise.all(promises);
    } catch (error) {
      console.error('Error fetching multiple time series:', error);
      throw error;
    }
  }

  /**
   * Search indicators by keyword
   * @param {string} keyword - Search term
   * @returns {Promise<Object>} Filtered indicators
   */
  async searchIndicators(keyword) {
    const data = await this.getIndicators();
    const filtered = {};
    
    Object.entries(data.indicators).forEach(([key, indicator]) => {
      if (
        indicator.label.toLowerCase().includes(keyword.toLowerCase()) ||
        indicator.description.toLowerCase().includes(keyword.toLowerCase())
      ) {
        filtered[key] = indicator;
      }
    });
    
    return { indicators: filtered };
  }

  /**
   * Get indicator metadata
   * @param {string} indicatorId - Indicator ID
   * @returns {Promise<Object>} Indicator metadata
   */
  async getIndicatorMetadata(indicatorId) {
    const data = await this.getIndicators();
    return data.indicators[indicatorId] || null;
  }
}

// Export singleton instance
export const imfApi = new IMFApiService();
export default imfApi;