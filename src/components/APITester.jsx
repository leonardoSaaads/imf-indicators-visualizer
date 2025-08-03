// src/components/APITester.jsx
import React, { useState } from 'react';
import { useIndicators, useCountries, useRegions, useGroups, useTimeSeries } from '../hooks/useIMFData';

const APITester = () => {
  const [activeTest, setActiveTest] = useState(null);
  const [timeSeriesParams, setTimeSeriesParams] = useState({
    indicatorId: 'NGDP_RPCH',
    entities: ['USA', 'CHN'],
    periods: ['2022', '2023']
  });

  // Hooks para diferentes endpoints
  const { indicators, loading: indicatorsLoading, error: indicatorsError } = useIndicators();
  const { countries, loading: countriesLoading, error: countriesError } = useCountries();
  const { regions, loading: regionsLoading, error: regionsError } = useRegions();
  const { groups, loading: groupsLoading, error: groupsError } = useGroups();
  const { data: timeSeriesData, loading: timeSeriesLoading, error: timeSeriesError, fetchTimeSeries } = useTimeSeries();

  const handleTestTimeSeries = async () => {
    try {
      await fetchTimeSeries(
        timeSeriesParams.indicatorId,
        timeSeriesParams.entities,
        timeSeriesParams.periods
      );
    } catch (error) {
      console.error('Error testing time series:', error);
    }
  };

  const renderTestSection = (title, data, loading, error, dataKey = null) => (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="flex items-center space-x-2">
          {loading && (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          )}
          <div className={`w-3 h-3 rounded-full ${
            error ? 'bg-red-500' : loading ? 'bg-yellow-500' : 'bg-green-500'
          }`}></div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Erro:</strong> {error}
          {error.includes('CORS') && (
            <div className="mt-2 text-sm">
              <strong>Solução:</strong> Certifique-se de que o vite.config.js está configurado com o proxy.
              <br />
              Reinicie o servidor de desenvolvimento: <code className="bg-gray-200 px-1 rounded">npm run dev</code>
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="text-gray-600">Carregando dados...</div>
      )}

      {!loading && !error && data && (
        <div>
          <div className="mb-2 text-sm text-gray-600">
            Total de registros: {Object.keys(dataKey ? data[dataKey] || {} : data).length}
          </div>
          
          <button
            onClick={() => setActiveTest(activeTest === title ? null : title)}
            className="mb-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {activeTest === title ? 'Ocultar' : 'Mostrar'} Dados
          </button>

          {activeTest === title && (
            <div className="bg-gray-100 p-4 rounded max-h-96 overflow-auto">
              <pre className="text-xs text-gray-800">
                {JSON.stringify(dataKey ? data[dataKey] : data, null, 2)}
              </pre>
            </div>
          )}

          {/* Mostrar alguns exemplos */}
          <div className="mt-3">
            <h4 className="font-medium text-gray-700 mb-2">Primeiros 3 registros:</h4>
            <div className="bg-gray-50 p-3 rounded text-sm">
              {Object.entries(dataKey ? data[dataKey] || {} : data)
                .slice(0, 3)
                .map(([key, value]) => (
                  <div key={key} className="mb-1">
                    <strong>{key}:</strong> {value.label || JSON.stringify(value).substring(0, 100)}...
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Teste de Integração - API IMF
        </h1>
        <p className="text-gray-600">
          Verificação dos endpoints da API do Fundo Monetário Internacional
        </p>
        <div className="mt-2 p-3 bg-blue-50 rounded text-sm text-blue-800">
          <strong>Ambiente:</strong> {import.meta.env.DEV ? 'Desenvolvimento (com proxy)' : 'Produção (com CORS proxy)'}
        </div>
      </div>

      {/* Status Geral */}
      <div className="mb-8 p-6 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">Status dos Endpoints</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Indicadores', loading: indicatorsLoading, error: indicatorsError },
            { name: 'Países', loading: countriesLoading, error: countriesError },
            { name: 'Regiões', loading: regionsLoading, error: regionsError },
            { name: 'Grupos', loading: groupsLoading, error: groupsError }
          ].map(({ name, loading, error }) => (
            <div key={name} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                error ? 'bg-red-500' : loading ? 'bg-yellow-500' : 'bg-green-500'
              }`}></div>
              <span className="text-sm font-medium">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Testes dos Endpoints */}
      {renderTestSection('Indicadores', { indicators }, indicatorsLoading, indicatorsError, 'indicators')}
      {renderTestSection('Países', { countries }, countriesLoading, countriesError, 'countries')}
      {renderTestSection('Regiões', { regions }, regionsLoading, regionsError, 'regions')}
      {renderTestSection('Grupos', { groups }, groupsLoading, groupsError, 'groups')}

      {/* Teste de Time Series */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Teste de Séries Temporais</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Indicador
            </label>
            <input
              type="text"
              value={timeSeriesParams.indicatorId}
              onChange={(e) => setTimeSeriesParams(prev => ({
                ...prev,
                indicatorId: e.target.value
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: NGDP_RPCH"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Países/Regiões (separados por vírgula)
            </label>
            <input
              type="text"
              value={timeSeriesParams.entities.join(',')}
              onChange={(e) => setTimeSeriesParams(prev => ({
                ...prev,
                entities: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: USA,CHN,BRA"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Períodos (separados por vírgula)
            </label>
            <input
              type="text"
              value={timeSeriesParams.periods.join(',')}
              onChange={(e) => setTimeSeriesParams(prev => ({
                ...prev,
                periods: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: 2022,2023"
            />
          </div>
        </div>

        <button
          onClick={handleTestTimeSeries}
          disabled={timeSeriesLoading}
          className="mb-4 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 transition-colors"
        >
          {timeSeriesLoading ? 'Testando...' : 'Testar Séries Temporais'}
        </button>

        {timeSeriesError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <strong>Erro:</strong> {timeSeriesError}
          </div>
        )}

        {timeSeriesData && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Dados da Série Temporal:</h4>
            <div className="bg-gray-100 p-4 rounded max-h-96 overflow-auto">
              <pre className="text-xs text-gray-800">
                {JSON.stringify(timeSeriesData, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Instruções */}
      <div className="mt-8 p-6 bg-yellow-50 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Instruções para Resolução de CORS</h3>
        <div className="text-yellow-700 space-y-2 text-sm">
          <p><strong>1. Atualize o vite.config.js</strong> com a configuração de proxy fornecida</p>
          <p><strong>2. Reinicie o servidor:</strong> <code className="bg-yellow-200 px-1 rounded">npm run dev</code></p>
          <p><strong>3. Verifique:</strong> Os indicadores devem ficar verdes após o restart</p>
          <p><strong>Nota:</strong> Em produção, será usado um proxy CORS automático</p>
        </div>
      </div>
    </div>
  );
};

export default APITester;