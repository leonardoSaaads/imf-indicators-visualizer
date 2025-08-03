// src/components/charts/ComparisonChart.jsx
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';

// Define a color palette for chart lines
const CHART_COLORS = [
  '#2563EB', // blue
  '#F59E42', // orange
  '#10B981', // green
  '#EF4444', // red
  '#A78BFA', // purple
  '#FBBF24', // yellow
  '#14B8A6', // teal
  '#F472B6', // pink
  '#6B7280', // gray
  '#F87171', // light red
];

const CustomComparisonTooltip = memo(({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg max-w-xs">
      <p className="font-semibold text-gray-900 mb-3 text-center border-b border-gray-100 pb-2">
        Período: {label}
      </p>
      <div className="space-y-2">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm font-medium text-gray-700 truncate">
                {entry.name}
              </span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {typeof entry.value === 'number' 
                ? entry.value.toLocaleString('pt-BR', { 
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2 
                  })
                : entry.value || 'N/A'
              }
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

CustomComparisonTooltip.displayName = 'CustomComparisonTooltip';

export const ComparisonChart = memo(({ 
  data, 
  countries = [], 
  indicator, 
  title, 
  className = '',
  height = 400,
  showGrid = true 
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
        aria-label="Gráfico de comparação sem dados disponíveis"
      >
        <div className="text-gray-400 mb-2">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
              d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" 
            />
          </svg>
        </div>
        <p className="text-gray-500 text-sm font-medium">Nenhum dado para comparação</p>
        <p className="text-gray-400 text-xs mt-1">Selecione países e períodos para visualizar</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {indicator && (
            <p className="text-sm text-gray-600 mt-1">Indicador: {indicator}</p>
          )}
        </div>
      )}
      
      <div className="p-4">
        <ResponsiveContainer width="100%" height={height}>
          <ComposedChart data={processedData} {...chartConfig}>
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
            <Tooltip content={<CustomComparisonTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            {countries.map((country, index) => (
              <Line
                key={country}
                type="monotone"
                dataKey={country}
                stroke={CHART_COLORS[index % CHART_COLORS.length]}
                strokeWidth={3}
                dot={{ r: 5, strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 7, strokeWidth: 2 }}
                connectNulls={false}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

ComparisonChart.displayName = 'ComparisonChart';

ComparisonChart.propTypes = {
  data: PropTypes.array,
  countries: PropTypes.array,
  indicator: PropTypes.string,
  title: PropTypes.string,
  className: PropTypes.string,
  height: PropTypes.number,
  showGrid: PropTypes.bool
};