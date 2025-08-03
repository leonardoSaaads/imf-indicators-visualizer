// src/components/charts/LineChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';

// Define a color palette for chart lines
const CHART_COLORS = [
  '#2563EB', // blue
  '#F59E42', // orange
  '#10B981', // green
  '#EF4444', // red
  '#6366F1', // indigo
  '#F472B6', // pink
  '#FBBF24', // yellow
  '#6EE7B7', // teal
  '#A78BFA', // purple
  '#F87171', // light red
];

const CustomLineTooltip = memo(({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
      <p className="font-semibold text-gray-900 mb-3 text-center border-b border-gray-100 pb-2">
        {label}
      </p>
      <div className="space-y-2">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm font-medium text-gray-700">
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

CustomLineTooltip.displayName = 'CustomLineTooltip';

export const IMFLineChart = memo(({ 
  data, 
  indicators = [], 
  title, 
  className = '',
  height = 400,
  showGrid = true,
  showLegend = true,
  strokeWidth = 3 
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
        aria-label="Gráfico de linha sem dados disponíveis"
      >
        <div className="text-gray-400 mb-2">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
            />
          </svg>
        </div>
        <p className="text-gray-500 text-sm font-medium">Nenhum dado disponível</p>
        <p className="text-gray-400 text-xs mt-1">Configure os filtros para visualizar as tendências</p>
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
          <LineChart data={processedData} {...chartConfig}>
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
            <Tooltip content={<CustomLineTooltip />} />
            {showLegend && (
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
            )}
            {indicators.map((indicator, index) => (
              <Line
                key={indicator}
                type="monotone"
                dataKey={indicator}
                stroke={CHART_COLORS[index % CHART_COLORS.length]}
                strokeWidth={strokeWidth}
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 2 }}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

IMFLineChart.displayName = 'IMFLineChart';

IMFLineChart.propTypes = {
  data: PropTypes.array,
  indicators: PropTypes.array,
  title: PropTypes.string,
  className: PropTypes.string,
  height: PropTypes.number,
  showGrid: PropTypes.bool,
  showLegend: PropTypes.bool,
  strokeWidth: PropTypes.number
};