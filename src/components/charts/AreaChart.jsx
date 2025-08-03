// src/components/charts/AreaChart.jsx
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';

const CHART_COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
  '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
];

const CustomAreaTooltip = memo(({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);

  return (
    <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
      <p className="font-semibold text-gray-900 mb-2">{`Período: ${label}`}</p>
      <p className="text-sm text-gray-600 mb-3 pb-2 border-b border-gray-100">
        Total: {total.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
      </p>
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-700">{entry.name}</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-gray-900">
                {entry.value?.toLocaleString('pt-BR', { 
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2 
                }) || '0'}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                ({((entry.value / total) * 100).toFixed(1)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

CustomAreaTooltip.displayName = 'CustomAreaTooltip';

export const IMFAreaChart = memo(({ 
  data, 
  countries = [], 
  title, 
  className = '',
  height = 400,
  showGrid = true,
  showLegend = true,
  stacked = true
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
      >
        <div className="text-gray-400 mb-2">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
              d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" 
            />
          </svg>
        </div>
        <p className="text-gray-500 text-sm font-medium">Dados indisponíveis</p>
        <p className="text-gray-400 text-xs mt-1">Configure os filtros para visualizar</p>
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
          <AreaChart data={processedData} {...chartConfig}>
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
            <Tooltip content={<CustomAreaTooltip />} />
            {showLegend && (
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="rect"
              />
            )}
            {countries.map((country, index) => (
              <Area
                key={country}
                type="monotone"
                dataKey={country}
                stackId={stacked ? "1" : country}
                stroke={CHART_COLORS[index % CHART_COLORS.length]}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
                fillOpacity={0.7}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

IMFAreaChart.displayName = 'IMFAreaChart';

IMFAreaChart.propTypes = {
  data: PropTypes.array,
  countries: PropTypes.array,
  title: PropTypes.string,
  className: PropTypes.string,
  height: PropTypes.number,
  showGrid: PropTypes.bool,
  showLegend: PropTypes.bool,
  stacked: PropTypes.bool
};