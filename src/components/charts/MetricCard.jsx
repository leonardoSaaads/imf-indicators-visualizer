// src/components/charts/MetricCard.jsx
import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ArrowUpRight, ArrowDownRight, ArrowRight } from 'lucide-react';

const MetricCardSkeleton = memo(({ className }) => (
  <div className={`bg-white p-6 rounded-lg border border-gray-200 animate-pulse ${className}`}>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
    <div className="h-8 bg-gray-200 rounded w-1/2 mb-3"></div>
    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
  </div>
));

MetricCardSkeleton.displayName = 'MetricCardSkeleton';

export const MetricCard = memo(({ 
  title, 
  value, 
  unit, 
  change, 
  period, 
  className = '',
  loading = false,
  icon,
  trend = 'neutral' // 'positive', 'negative', 'neutral'
}) => {
  const { formattedValue, changeColor, changeIcon, trendColor } = useMemo(() => {
    const formatValue = (val) => {
      if (val === null || val === undefined || val === '') return 'N/A';
      if (typeof val !== 'number') return val;
      
      const absVal = Math.abs(val);
      if (absVal >= 1e9) return `${(val / 1e9).toFixed(2)}B`;
      if (absVal >= 1e6) return `${(val / 1e6).toFixed(2)}M`;
      if (absVal >= 1e3) return `${(val / 1e3).toFixed(2)}K`;
      return val.toLocaleString('pt-BR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });
    };

    const getChangeColor = (changeValue) => {
      if (changeValue > 0) return 'text-emerald-600 bg-emerald-50';
      if (changeValue < 0) return 'text-red-600 bg-red-50';
      return 'text-gray-600 bg-gray-50';
    };

    const getChangeIcon = (changeValue) => {
      if (changeValue > 0) return <ArrowUpRight size={16} />;
      if (changeValue < 0) return <ArrowDownRight size={16} />;
      return <ArrowRight size={16} />;
    };

    const getTrendColor = (trendType) => {
      switch (trendType) {
        case 'positive': return 'border-l-emerald-500';
        case 'negative': return 'border-l-red-500';
        default: return 'border-l-blue-500';
      }
    };

    return {
      formattedValue: formatValue(value),
      changeColor: getChangeColor(change),
      changeIcon: getChangeIcon(change),
      trendColor: getTrendColor(trend)
    };
  }, [value, change, trend]);

  if (loading) {
    return <MetricCardSkeleton className={className} />;
  }

  return (
    <div className={`bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 border-l-4 ${trendColor} ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-600 leading-tight">{title}</h3>
        {icon && (
          <div className="text-gray-400 ml-2">
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-3xl font-bold text-gray-900 leading-none">
          {formattedValue}
        </span>
        {unit && (
          <span className="text-sm text-gray-500 font-medium">{unit}</span>
        )}
      </div>
      
      {change !== undefined && change !== null && !isNaN(change) && (
        <div className="flex items-center gap-2">
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${changeColor}`}>
            <span className="flex items-center text-gray-500">{changeIcon}</span>
            <span>
              {change > 0 ? '+' : ''}{Math.abs(change).toFixed(2)}%
            </span>
          </div>
          {period && (
            <span className="text-xs text-gray-500">vs {period}</span>
          )}
        </div>
      )}
      
      {(!change && change !== 0) && period && (
        <div className="text-xs text-gray-400">
          Período: {period}
        </div>
      )}
    </div>
  );
});

MetricCard.displayName = 'MetricCard';

MetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  unit: PropTypes.string,
  change: PropTypes.number,
  period: PropTypes.string,
  className: PropTypes.string,
  loading: PropTypes.bool,
  icon: PropTypes.node,
  trend: PropTypes.oneOf(['positive', 'negative', 'neutral'])
};
