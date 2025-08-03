// src/components/charts/BarChart.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';

const CHART_COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
  '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
];

const CustomTooltip = memo(({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
      <p className="font-medium text-gray-900 mb-2">{`Período: ${label}`}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 mb-1">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-700">
            {entry.name}: {typeof entry.value === 'number' 
              ? entry.value.toLocaleString('pt-BR', { 
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2 
                })
              : entry.value
            }
          </span>
        </div>
      ))}
    </div>
  );
});

CustomTooltip.displayName = 'CustomTooltip';

export const IMFBarChart = memo(({ 
  data, 
  indicators = [], 
  title, 
  className = '',
  height = 400,
  showGrid = true,
  showLegend = true 
}) => {
  const chartConfig = useMemo(() => ({
    margin: { top: 20, right: 30, left: 20, bottom: 20 }
  }), []);

  const processedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.filter(item => item && typeof item === 'object');
  }, [data]);

  if (!processedData.length) {
    return (
      <div 
        className={`flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 ${className}`}
        style={{ height }}
        role="img"
        aria-label="Gráfico sem dados disponíveis"
      >
        <div className="text-gray-400 mb-2">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
            />
          </svg>
        </div>
        <p className="text-gray-500 text-sm font-medium">Nenhum dado disponível</p>
        <p className="text-gray-400 text-xs mt-1">Selecione os filtros para visualizar o gráfico</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      
      <div className="p-4">
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={processedData} {...chartConfig}>
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.7} />
            )}
            <XAxis 
              dataKey="period"
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickLine={{ stroke: '#D1D5DB' }}
              axisLine={{ stroke: '#D1D5DB' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickLine={{ stroke: '#D1D5DB' }}
              axisLine={{ stroke: '#D1D5DB' }}
              tickFormatter={(value) => {
                if (typeof value !== 'number') return value;
                if (Math.abs(value) >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
                if (Math.abs(value) >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
                if (Math.abs(value) >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
                return value.toLocaleString('pt-BR');
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && (
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="rect"
              />
            )}
            {indicators.map((indicator, index) => (
              <Bar
                key={indicator}
                dataKey={indicator}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
                radius={[2, 2, 0, 0]}
                stroke="none"
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

IMFBarChart.displayName = 'IMFBarChart';

IMFBarChart.propTypes = {
  data: PropTypes.array,
  indicators: PropTypes.array,
  title: PropTypes.string,
  className: PropTypes.string,
  height: PropTypes.number,
  showGrid: PropTypes.bool,
  showLegend: PropTypes.bool
};