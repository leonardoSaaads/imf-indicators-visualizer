// src/components/charts/StatisticsPanel.jsx
import { memo, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { calculateAllStatistics, formatStatisticsForDisplay } from '../../utils/statistics';
import { BarChart2, LineChart, Ruler, TrendingDown, AlertTriangle, Clock } from 'lucide-react';


const StatisticCard = memo(({ category, metric, value, description, colorClass }) => (
  <div className={`bg-white p-4 rounded-lg border-l-4 ${colorClass} shadow-sm hover:shadow-md transition-shadow duration-200`}>
    <div className="flex items-start justify-between mb-2">
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-gray-800">{metric}</h4>
        <p className="text-xs text-gray-500 mt-1 leading-tight">{description}</p>
      </div>
      <span className="text-lg font-bold text-gray-900 ml-3">{value}</span>
    </div>
    <div className="text-xs text-gray-400 uppercase tracking-wide font-medium">
      {category}
    </div>
  </div>
));

StatisticCard.displayName = 'StatisticCard';

const CategorySection = memo(({ title, stats, colorClass, icon }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
      {icon && <span className="text-lg">{icon}</span>}
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <span className="text-sm text-gray-500">({stats.length} métricas)</span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {stats.map((stat, index) => (
        <StatisticCard
          key={`${stat.category}-${stat.metric}-${index}`}
          category={stat.category}
          metric={stat.metric}
          value={stat.value}
          description={stat.description}
          colorClass={colorClass}
        />
      ))}
    </div>
  </div>
));

CategorySection.displayName = 'CategorySection';

const CountryStatistics = memo(({ country, data, selectedIndicator }) => {
  const statistics = useMemo(() => {
    if (!data || data.length === 0) return null;
    return calculateAllStatistics(data, country);
  }, [data, country]);

  const formattedStats = useMemo(() => {
    if (!statistics) return {};
    const allStats = formatStatisticsForDisplay(statistics);
    
    return {
      basic: allStats.filter(stat => stat.category === 'Básicas'),
      quartiles: allStats.filter(stat => stat.category === 'Quartis'),
      variability: allStats.filter(stat => stat.category === 'Variabilidade'),
      distribution: allStats.filter(stat => stat.category === 'Distribuição'),
      outliers: allStats.filter(stat => stat.category === 'Outliers'),
      temporal: allStats.filter(stat => stat.category === 'Temporal')
    };
  }, [statistics]);

  if (!statistics) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
            />
          </svg>
        </div>
        <p className="text-gray-500 text-sm">Dados insuficientes para análise estatística</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header com informações do país */}
      <div className="text-center pb-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{country}</h2>
        <p className="text-gray-600">Análise Estatística - {selectedIndicator}</p>
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          {statistics.basic.count} observações analisadas
        </div>
      </div>

      {/* Estatísticas por categoria */}
      <CategorySection
        title="Tendência Central"
        stats={formattedStats.basic}
        colorClass="border-l-blue-500"
        icon={<BarChart2 size={20} className="text-blue-500" />}
      />

      <CategorySection
        title="Distribuição dos Dados"
        stats={formattedStats.quartiles}
        colorClass="border-l-green-500"
        icon={<LineChart size={20} className="text-green-500" />}
      />

      <CategorySection
        title="Variabilidade"
        stats={formattedStats.variability}
        colorClass="border-l-yellow-500"
        icon={<Ruler size={20} className="text-yellow-500" />}
      />

      <CategorySection
        title="Forma da Distribuição"
        stats={formattedStats.distribution}
        colorClass="border-l-purple-500"
        icon={<TrendingDown size={20} className="text-purple-500" />}
      />

      <CategorySection
        title="Valores Atípicos"
        stats={formattedStats.outliers}
        colorClass="border-l-red-500"
        icon={<AlertTriangle size={20} className="text-red-500" />}
      />

      <CategorySection
        title="Análise Temporal"
        stats={formattedStats.temporal}
        colorClass="border-l-indigo-500"
        icon={<Clock size={20} className="text-indigo-500" />}
      />

      {/* Interpretações automáticas */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>🔍</span>
          Interpretações Automáticas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="p-3 bg-white rounded border-l-4 border-l-blue-500">
              <strong>Tendência:</strong>
              <span className="ml-2 text-gray-700">
                {statistics.distribution.skewness > 0.5 
                  ? 'Assimétrica à direita (valores altos menos frequentes)'
                  : statistics.distribution.skewness < -0.5 
                    ? 'Assimétrica à esquerda (valores baixos menos frequentes)'
                    : 'Aproximadamente simétrica'
                }
              </span>
            </div>
            <div className="p-3 bg-white rounded border-l-4 border-l-green-500">
              <strong>Variabilidade:</strong>
              <span className="ml-2 text-gray-700">
                {statistics.variance.coefficientOfVariation < 0.1 
                  ? 'Baixa variabilidade'
                  : statistics.variance.coefficientOfVariation > 0.3 
                    ? 'Alta variabilidade'
                    : 'Variabilidade moderada'
                }
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="p-3 bg-white rounded border-l-4 border-l-yellow-500">
              <strong>Outliers:</strong>
              <span className="ml-2 text-gray-700">
                {statistics.outliers.outlierCount === 0 
                  ? 'Nenhum valor atípico detectado'
                  : `${statistics.outliers.outlierCount} valor(es) atípico(s) identificado(s)`
                }
              </span>
            </div>
            <div className="p-3 bg-white rounded border-l-4 border-l-purple-500">
              <strong>Autocorrelação:</strong>
              <span className="ml-2 text-gray-700">
                {Math.abs(statistics.timeSeries.autocorrelation) > 0.7 
                  ? 'Forte dependência temporal'
                  : Math.abs(statistics.timeSeries.autocorrelation) > 0.3 
                    ? 'Dependência temporal moderada'
                    : 'Baixa dependência temporal'
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

CountryStatistics.displayName = 'CountryStatistics';

export const StatisticsPanel = memo(({ 
  data, 
  countries, 
  selectedIndicator, 
  className = '',
  title = 'Análise Estatística Detalhada'
}) => {
  const countryData = useMemo(() => {
    if (!data || !Array.isArray(data) || countries.length === 0) return {};
    
    const result = {};
    countries.forEach(country => {
      result[country] = data
        .map(item => item[country])
        .filter(value => value !== null && value !== undefined && !isNaN(value));
    });
    
    return result;
  }, [data, countries]);

  const [selectedCountry, setSelectedCountry] = useState(countries[0] || '');

  if (!data || countries.length === 0) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center ${className}`}>
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Análise Estatística</h3>
        <p className="text-gray-500">Selecione dados para ver estatísticas detalhadas</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {/* Header com seletor de país */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          {countries.length > 1 && (
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {countries.map(country => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Conteúdo das estatísticas */}
      <div className="p-6">
        <CountryStatistics
          country={selectedCountry}
          data={countryData[selectedCountry] || []}
          selectedIndicator={selectedIndicator}
        />
      </div>
    </div>
  );
});

StatisticsPanel.displayName = 'StatisticsPanel';

StatisticsPanel.propTypes = {
  data: PropTypes.array,
  countries: PropTypes.array,
  selectedIndicator: PropTypes.string,
  className: PropTypes.string,
  title: PropTypes.string
};