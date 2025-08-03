// src/components/data/PeriodSelector.jsx
import { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const PeriodSelector = ({ value = [], onChange, className = '' }) => {
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');

  const currentYear = new Date().getFullYear();
  const minYear = 1980;

  const generateYearRange = () => {
    const start = parseInt(startYear) || minYear;
    const end = parseInt(endYear) || currentYear;
    
    if (start > end) return;
    
    const years = [];
    for (let year = start; year <= end; year++) {
      years.push(year.toString());
    }
    onChange(years);
  };

  const removeYear = (yearToRemove) => {
    onChange(value.filter(year => year !== yearToRemove));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-2 gap-2">
        <Input
          type="number"
          placeholder="Ano inicial"
          value={startYear}
          onChange={(e) => setStartYear(e.target.value)}
          min={minYear}
          max={currentYear}
        />
        <Input
          type="number"
          placeholder="Ano final"
          value={endYear}
          onChange={(e) => setEndYear(e.target.value)}
          min={minYear}
          max={currentYear}
        />
      </div>
      
      <Button onClick={generateYearRange} variant="outline" className="w-full">
        Gerar Período
      </Button>

      {value.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Períodos selecionados:</p>
          <div className="flex flex-wrap gap-2">
            {value.map(year => (
              <span
                key={year}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded cursor-pointer hover:bg-blue-200"
                onClick={() => removeYear(year)}
              >
                {year}
                <span className="text-blue-600">×</span>
              </span>
            ))}
          </div>
          <Button
            onClick={() => onChange([])}
            variant="outline"
            size="sm"
            className="text-red-600 hover:bg-red-50"
          >
            Limpar Todos
          </Button>
        </div>
      )}
    </div>
  );
};