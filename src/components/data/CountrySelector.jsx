// src/components/data/CountrySelector.jsx
import { useState, useMemo } from 'react';
import { useCountries } from '../../hooks/useIMFData';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Alert } from '../ui/Alert';

export const CountrySelector = ({ value = [], onChange, className = '' }) => {
  const { countries, loading, error } = useCountries();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Países populares/mais usados para acesso rápido
  const popularCountries = useMemo(() => [
    'USA', 'BRA', 'CHN', 'DEU', 'JPN', 'GBR', 'FRA', 'ITA', 'CAN', 'AUS',
    'IND', 'RUS', 'KOR', 'ESP', 'MEX', 'IDN', 'NLD', 'SAU', 'TUR', 'CHE'
  ], []);

  const filteredSuggestions = useMemo(() => {
    if (!countries || Object.keys(countries).length === 0) return [];
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return Object.entries(countries)
      .filter(([key, country]) => 
        !searchTerm || 
        (country.label && country.label.toLowerCase().includes(lowerSearchTerm)) ||
        (key.toLowerCase().includes(lowerSearchTerm))
      )
      .map(([key, country]) => ({
        value: key,
        label: country.label || 'País sem nome',
        code: key
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
      .slice(0, 10); // Limita a 10 sugestões
  }, [countries, searchTerm]);

  const popularCountriesOptions = useMemo(() => {
    if (!countries) return [];
    
    return popularCountries
      .filter(code => countries[code])
      .map(code => ({
        value: code,
        label: countries[code].label || 'País sem nome',
        code
      }));
  }, [countries, popularCountries]);

  const addCountry = (countryCode) => {
    if (!value.includes(countryCode)) {
      onChange([...value, countryCode]);
    }
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const removeCountry = (countryCode) => {
    onChange(value.filter(code => code !== countryCode));
  };

  const clearAll = () => {
    onChange([]);
  };

  const getCountryLabel = (code) => {
    return countries?.[code]?.label || code;
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <LoadingSpinner size="sm" />
        <span className="text-sm text-gray-600">Carregando países...</span>
      </div>
    );
  }

  if (error) {
    return <Alert type="error" title="Erro ao carregar países">{error}</Alert>;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Campo de busca */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Buscar país (nome ou código)..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(e.target.value.length > 0);
          }}
          onFocus={() => searchTerm && setShowSuggestions(true)}
        />
        
        {/* Sugestões de busca */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {filteredSuggestions.map(country => (
              <button
                key={country.value}
                onClick={() => addCountry(country.value)}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={value.includes(country.value)}
              >
                <span className="font-medium">{country.label}</span>
                <span className="text-sm text-gray-500 ml-2">({country.code})</span>
                {value.includes(country.value) && (
                  <span className="text-xs text-green-600 ml-2">✓ Selecionado</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Países populares */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Países populares:</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {popularCountriesOptions.map(country => (
            <Button
              key={country.value}
              onClick={() => addCountry(country.value)}
              variant={value.includes(country.value) ? "primary" : "outline"}
              size="sm"
              disabled={value.includes(country.value)}
              className="text-xs justify-start"
            >
              {country.code}
              {value.includes(country.value) && <span className="ml-1">✓</span>}
            </Button>
          ))}
        </div>
      </div>

      {/* Países selecionados */}
      {value.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              Países selecionados ({value.length}):
            </p>
            <Button
              onClick={clearAll}
              variant="outline"
              size="sm"
              className="text-red-600 hover:bg-red-50"
            >
              Limpar Todos
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {value.map(code => (
              <span
                key={code}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-md cursor-pointer hover:bg-blue-200 transition-colors"
                onClick={() => removeCountry(code)}
                title={`Clique para remover ${getCountryLabel(code)}`}
              >
                <span className="font-medium">{code}</span>
                <span className="text-xs opacity-75">
                  {getCountryLabel(code).substring(0, 15)}
                  {getCountryLabel(code).length > 15 ? '...' : ''}
                </span>
                <span className="text-blue-600 hover:text-blue-800">×</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Feedback quando nenhum país encontrado */}
      {searchTerm && filteredSuggestions.length === 0 && (
        <div className="text-sm text-gray-500 italic">
          Nenhum país encontrado para "{searchTerm}"
        </div>
      )}
    </div>
  );
};