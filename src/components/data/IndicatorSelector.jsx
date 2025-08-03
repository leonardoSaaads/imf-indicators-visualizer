// src/components/data/IndicatorSelector.jsx
import { useState, useMemo } from 'react';
import { useIndicators } from '../../hooks/useIMFData';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Alert } from '../ui/Alert';

export const IndicatorSelector = ({ value, onChange, className = '' }) => {
  const { indicators, loading, error } = useIndicators();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Categorias de indicadores mais comuns
  const categories = {
    all: 'Todos',
    gdp: 'PIB',
    population: 'População',
    finance: 'Financeiro',
    trade: 'Comércio'
  };

  // Indicadores populares por categoria
  const popularIndicators = {
    gdp: ['NGDPD', 'NGDPDPC', 'NGDP_RPCH', 'NGDPRPPPPC'],
    population: ['LP', 'LUR'],
    finance: ['GGXWDG_NGDP', 'GGR_NGDP', 'GGX_NGDP'],
    trade: ['BCA_NGDPD', 'TX_RPCH', 'TM_RPCH'],
    reserves: ['ENDA_NGDPD', 'FI_RES_TOT_CD']
  };

  const filteredSuggestions = useMemo(() => {
    if (!indicators || Object.keys(indicators).length === 0) return [];

    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return Object.entries(indicators)
      .filter(([key, indicator]) => {
        // Filtro por categoria se não for 'all'
        if (selectedCategory !== 'all') {
          const categoryIndicators = popularIndicators[selectedCategory] || [];
          const matchesCategory = categoryIndicators.includes(key) || 
            (indicator.label && indicator.label.toLowerCase().includes(selectedCategory)) ||
            (indicator.description && indicator.description.toLowerCase().includes(selectedCategory));
          
          if (!matchesCategory) return false;
        }

        // Filtro por termo de busca
        return !searchTerm || 
          (indicator.label && indicator.label.toLowerCase().includes(lowerSearchTerm)) ||
          (indicator.description && indicator.description.toLowerCase().includes(lowerSearchTerm)) ||
          (key.toLowerCase().includes(lowerSearchTerm));
      })
      .map(([key, indicator]) => ({
        value: key,
        label: indicator.label || 'Indicador sem nome',
        description: indicator.description || '',
        unit: indicator.unit || '',
        code: key
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
      .slice(0, 8); // Limita a 8 sugestões
  }, [indicators, searchTerm, selectedCategory]);

  const getPopularByCategory = (category) => {
    if (!indicators || category === 'all') return [];
    
    const categoryIndicators = popularIndicators[category] || [];
    return categoryIndicators
      .filter(code => indicators[code])
      .map(code => ({
        value: code,
        label: indicators[code].label || 'Indicador sem nome',
        code
      }))
      .slice(0, 6);
  };

  const selectIndicator = (indicatorCode) => {
    onChange(indicatorCode);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const clearSelection = () => {
    onChange('');
  };

  const getIndicatorInfo = (code) => {
    return indicators?.[code] || {};
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <LoadingSpinner size="sm" />
        <span className="text-sm text-gray-600">Carregando indicadores...</span>
      </div>
    );
  }

  if (error) {
    return <Alert type="error" title="Erro ao carregar indicadores">{error}</Alert>;
  }

  const currentIndicator = value ? getIndicatorInfo(value) : null;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filtros por categoria */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Categorias:</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(categories).map(([key, label]) => (
            <Button
              key={key}
              onClick={() => {
                setSelectedCategory(key);
                setSearchTerm('');
                setShowSuggestions(false);
              }}
              variant={selectedCategory === key ? "primary" : "outline"}
              size="sm"
              className="text-xs"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Campo de busca */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Buscar indicador (nome, código ou descrição)..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(e.target.value.length > 0);
          }}
          onFocus={() => searchTerm && setShowSuggestions(true)}
        />
        
        {/* Sugestões de busca */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto">
            {filteredSuggestions.map(indicator => (
              <button
                key={indicator.value}
                onClick={() => selectIndicator(indicator.value)}
                className="w-full px-3 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{indicator.label}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {indicator.code}
                    </span>
                  </div>
                  {indicator.description && (
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {indicator.description.substring(0, 120)}
                      {indicator.description.length > 120 ? '...' : ''}
                    </p>
                  )}
                  {indicator.unit && (
                    <p className="text-xs text-blue-600">Unidade: {indicator.unit}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Indicadores populares da categoria selecionada */}
      {selectedCategory !== 'all' && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Indicadores populares - {categories[selectedCategory]}:
          </p>
          <div className="grid grid-cols-1 gap-2">
            {getPopularByCategory(selectedCategory).map(indicator => (
              <button
                key={indicator.value}
                onClick={() => selectIndicator(indicator.value)}
                className={`
                  w-full p-3 text-left rounded-lg border transition-all duration-200
                  ${value === indicator.value 
                    ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100' 
                    : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`
                        px-2 py-1 text-xs font-mono font-medium rounded
                        ${value === indicator.value 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-700'
                        }
                      `}>
                        {indicator.code}
                      </span>
                      {value === indicator.value && (
                        <span className="text-blue-600 text-sm">✓</span>
                      )}
                    </div>
                    <p className={`
                      text-sm leading-tight
                      ${value === indicator.value 
                        ? 'text-blue-900 font-medium' 
                        : 'text-gray-700'
                      }
                    `}>
                      {indicator.label}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Indicador selecionado */}
      {value && currentIndicator && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">Indicador selecionado:</p>
            <Button
              onClick={clearSelection}
              variant="outline"
              size="sm"
              className="text-red-600 hover:bg-red-50"
            >
              Limpar
            </Button>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                {value}
              </span>
              <span className="font-medium text-blue-900">
                {currentIndicator.label || 'N/A'}
              </span>
            </div>
            
            {currentIndicator.description && (
              <div>
                <p className="text-xs font-medium text-gray-700">Descrição:</p>
                <p className="text-xs text-gray-600">{currentIndicator.description}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              {currentIndicator.unit && (
                <div>
                  <p className="font-medium text-gray-700">Unidade:</p>
                  <p className="text-gray-600">{currentIndicator.unit}</p>
                </div>
              )}
              {currentIndicator.source && (
                <div>
                  <p className="font-medium text-gray-700">Fonte:</p>
                  <p className="text-gray-600">{currentIndicator.source}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Feedback quando nenhum indicador encontrado */}
      {searchTerm && filteredSuggestions.length === 0 && (
        <div className="text-sm text-gray-500 italic">
          Nenhum indicador encontrado para "{searchTerm}" na categoria {categories[selectedCategory]}
        </div>
      )}
    </div>
  );
};