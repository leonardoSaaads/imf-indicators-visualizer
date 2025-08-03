// src/components/data/RegionSelector.jsx
import { useState, useMemo } from 'react';
import { useRegions } from '../../hooks/useIMFData';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Alert } from '../ui/Alert';

export const RegionSelector = ({ value, onChange, multiple = false, className = '' }) => {
  const { regions, loading, error } = useRegions();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = useMemo(() => {
    if (!regions || Object.keys(regions).length === 0) return [];
    
    return Object.entries(regions)
      .filter(([key, region]) => 
        !searchTerm || 
        region.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        key.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map(([key, region]) => ({
        value: key,
        label: `${region.label} (${key})`
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [regions, searchTerm]);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <LoadingSpinner size="sm" />
        <span className="text-sm text-gray-600">Carregando regiões...</span>
      </div>
    );
  }

  if (error) {
    return <Alert type="error" title="Erro ao carregar regiões">{error}</Alert>;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Input
        type="text"
        placeholder="Buscar regiões..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Select
        options={filteredOptions}
        value={value}
        onChange={onChange}
        multiple={multiple}
        placeholder={multiple ? "Selecione regiões" : "Selecione uma região"}
      />
    </div>
  );
};